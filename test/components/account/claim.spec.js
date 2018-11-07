import Navbar from '../../../lib/components/navbar.vue';
import testData from '../../data';
import { mockRoute } from '../../http';
import { mockRouteThroughLogin } from '../../session';
import { submitForm } from '../../event';

const LOCATION = { path: '/account/claim', query: { token: 'a'.repeat(64) } };

describe('AccountClaim', () => {
  describe('navigation to /account/claim', () => {
    it('redirects to the root page after a login through the login page', () => {
      const { xmlFormId } = testData.extendedForms.createPast(1).last();
      return mockRouteThroughLogin(`/forms/${xmlFormId}`)
        .respondWithData(() => testData.extendedForms.last())
        .respondWithData(() => testData.extendedFormAttachments.sorted())
        .respondWithData(() => testData.simpleFieldKeys.sorted())
        .complete()
        .route(LOCATION)
        .respondWithProblems([500, 500, 500])
        .afterResponses(app => {
          app.vm.$route.path.should.equal('/');
        });
    });
  });

  it('navbar is visible', () =>
    mockRoute(LOCATION).then(app => {
      app.first(Navbar).vm.$el.style.display.should.equal('');
    }));

  it('field is focused', () =>
    mockRoute(LOCATION, { attachToDocument: true })
      .then(app => app.first('input[type="password"]').should.be.focused()));

  it('standard button thinking things', () =>
    // We need mockRoute() and not just mockHttp(), because the token is taken
    // from the URL.
    mockRoute(LOCATION)
      .complete()
      .request(app => submitForm(app, '#account-claim form', [
        ['input[type="password"]', 'password']
      ]))
      .standardButton());

  it('shows a custom alert for a 401.2 problem', () =>
    mockRoute(LOCATION)
      .request(app => submitForm(app, '#account-claim form', [
        ['input[type="password"]', 'password']
      ]))
      .respondWithProblem(() => ({
        code: 401.2,
        message: 'AccountClaim problem.'
      }))
      .afterResponse(app => {
        app.should.alert('danger', 'AccountClaim problem. The password reset link may have expired, and the password may need to be reset again.');
      }));

  describe('after successful response', () => {
    let app;
    beforeEach(() => mockRoute(LOCATION)
      .complete()
      .request(component => {
        app = component;
        return submitForm(app, '#account-claim form', [
          ['input[type="password"]', 'password']
        ]);
      })
      .respondWithSuccess());

    it('user is redirected to login', () => {
      app.vm.$route.path.should.equal('/login');
    });

    it('success message is shown', () => {
      app.should.alert('success');
    });
  });
});
