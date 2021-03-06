<!--
Copyright 2019 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/opendatakit/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
-->
<template>
  <modal id="project-archive" :state="state" :hideable="!awaitingResponse"
    backdrop @hide="$emit('hide')">
    <template #title>Archiving Project</template>
    <template #body>
      <div class="modal-introduction">
        <p>
          You are about to archive the Project
          &ldquo;{{ project != null ? project.name : '' }}&rdquo;. It will still
          work as it does now, but it will be sorted to the bottom of the
          Project List on the Central homepage.
        </p>
        <p>
          <strong>This action cannot be undone</strong>, but the ability to
          unarchive a Project is planned for a future release.
        </p>
        <p>Are you sure you wish to proceed?</p>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-danger"
          :disabled="awaitingResponse" @click="archive">
          Yes, I am sure <spinner :state="awaitingResponse"/>
        </button>
        <button type="button" class="btn btn-link" :disabled="awaitingResponse"
          @click="$emit('hide')">
          No, cancel
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from '../modal.vue';
import Spinner from '../spinner.vue';
import request from '../../mixins/request';
import { apiPaths } from '../../util/request';
import { noop } from '../../util/util';
import { requestData } from '../../store/modules/request';

export default {
  name: 'ProjectArchive',
  components: { Modal, Spinner },
  mixins: [request()],
  props: {
    state: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      awaitingResponse: false
    };
  },
  computed: requestData(['project']),
  methods: {
    archive() {
      this.patch(apiPaths.project(this.project.id), { archived: true })
        .then(response => {
          this.$store.commit('setData', {
            key: 'project',
            // We do not simply specify response.data, because it does not
            // include extended metadata.
            value: this.project.with({
              archived: true,
              updatedAt: response.data.updatedAt
            })
          });
          this.$emit('success');
        })
        .catch(noop);
    }
  }
};
</script>
