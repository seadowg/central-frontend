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
  <form id="audit-filters" class="form-inline" @submit.prevent>
    <span class="icon-filter"></span><span>Filter by</span>
    <div class="form-group">
      <select v-model="action" class="form-control" aria-label="Type">
        <option v-for="option of actionOptions" :key="option.value"
          :class="{ 'action-category': option.category }" :value="option.value">
          <template v-if="!option.category">&nbsp;&nbsp;&nbsp;</template>{{ option.text }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <flat-pickr v-model="dateRangeString" :config="flatPickrConfig"
        class="form-control" placeholder="Date range" aria-label="Date range"
        @on-close="closeCalendar"/>
    </div>
  </form>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import { DateTime } from 'luxon';

export default {
  name: 'AuditFilters',
  components: { flatPickr },
  props: {
    initial: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      action: this.initial.action,
      // An array of two DateTime objects
      dateRange: this.initial.dateRange,
      dateRangeString: this.dateRangeToString(this.initial.dateRange)
    };
  },
  computed: {
    actionOptions() {
      const categoryOption = (text, value) => ({ text, value, category: true });
      const actionOption = (text, value) => ({ text, value, category: false });
      return [
        categoryOption('(All Actions)', 'nonverbose'),
        categoryOption('Web User Actions', 'user'),
        actionOption('Create', 'user.create'),
        actionOption('Update Details', 'user.update'),
        actionOption('Assign Role', 'assignment.create'),
        actionOption('Revoke Role', 'assignment.delete'),
        actionOption('Retire', 'user.delete'),
        categoryOption('Project Actions', 'project'),
        actionOption('Create', 'project.create'),
        actionOption('Update Details', 'project.update'),
        actionOption('Delete', 'project.delete'),
        categoryOption('Form Actions', 'form'),
        actionOption('Create', 'form.create'),
        actionOption('Update Details', 'form.update'),
        actionOption('Update Attachments', 'form.attachment.update'),
        actionOption('Delete', 'form.delete')
      ];
    },
    flatPickrConfig() {
      return {
        mode: 'range',
        dateFormat: 'Y/m/d'
      };
    }
  },
  watch: {
    action: 'filter'
  },
  methods: {
    dateRangeToString(dateRange) {
      const start = dateRange[0].toFormat('yyyy/MM/dd');
      const end = dateRange[1].toFormat('yyyy/MM/dd');
      return `${start} to ${end}`;
    },
    filter() {
      this.$emit('filter', { action: this.action, dateRange: this.dateRange });
    },
    todayToToday() {
      const today = DateTime.local().startOf('day');
      return [today, today];
    },
    closeCalendar(dates) {
      const dateRange = dates.length !== 0
        ? dates.map(date => DateTime.fromJSDate(date))
        : this.todayToToday();
      if (dateRange[0].valueOf() !== this.dateRange[0].valueOf() ||
        dateRange[1].valueOf() !== this.dateRange[1].valueOf()) {
        this.dateRange = dateRange;
        this.filter();
      }
      // If the date range is cleared, this.dateRangeString will be empty, and
      // we will need to reset it (regardless of whether this.dateRange
      // changed).
      if (dates.length === 0)
        this.dateRangeString = this.dateRangeToString(dateRange);
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#audit-filters {
  .icon-filter {
    color: #999;
    margin-right: 6px;
  }

  .form-group {
    margin-left: 12px;
    // Align the .form-group elements with the text to their left.
    vertical-align: baseline;
  }

  .form-group + .form-group {
    margin-left: 21px;
  }

  .action-category {
    // Not all browsers support styling an <option> element this way.
    font-weight: bold;
  }

  .flatpickr-input {
    width: $width-flatpickr-range-input;
  }
}
</style>
