/*
Copyright 2017 Super Adventure Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/nafundi/super-adventure/blob/master/NOTICE.

This file is part of Super Adventure. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of Super Adventure,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
*/
import Vue from 'vue';

// Updates globals after login.
export function logIn(session, user) {
  Vue.prototype.$session = session;
  Vue.prototype.$user = user;
  const header = `Bearer ${session.token}`;
  Vue.prototype.$http.defaults.headers.common.Authorization = header;
}

// Updates globals after logout.
export function logOut() {
  Vue.prototype.$session = null;
  Vue.prototype.$user = null;
  delete Vue.prototype.$http.defaults.headers.common.Authorization;
}