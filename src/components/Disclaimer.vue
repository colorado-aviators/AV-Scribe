<script setup lang="ts">
    import {ref} from "vue"

    function setDisclaimerValid() {
        var date = new Date();
        localStorage.setItem(disclaimerAcknowledgedDate, date.toString());
    }

    function getDisclaimerValid() {
        let now = new Date();
        let val = localStorage.getItem(disclaimerAcknowledgedDate);
        if (!val) {
            return false;
        }
        let age = now.getTime() - Date.parse(val);
        let limit = disclaimerShelfLifeDays * 24 * 60 * 60 * 1000;
        return age < limit;
    }

    function acceptDisclaimer() {
      setDisclaimerValid();
      showModal.value = false;
    }

    const disclaimerAcknowledgedDate = "avwx-scribe-disclaimer-acknowledged-date";
    const disclaimerShelfLifeDays = 30;
    const showModal = ref(!getDisclaimerValid());
</script>

<template>
  <div class="modal-backdrop" v-if="showModal">
    <div class="modal">
      <header class="modal-header">
        <slot name="header">
          DISCLAIMER
        </slot>
      </header>

      <section class="modal-body">
        <slot name="body">
            This web app is provided "as is", free of charge, and without any guarantee as to the
            utility, accuracy, or sufficiency of the functionality afforded by its use.
        </slot>
       </section>

      <footer class="modal-footer">
        <slot name="footer">
            <a href="https://github.com/mcgsjoyner/AVWX-Scribe/blob/main/README.rst#disclaimer">
                <strong>Read full disclaimer here.</strong>
            </a>
        </slot>
        <button type="button" class="btn-green" @click="acceptDisclaimer">
          I ACCEPT
        </button>
      </footer>
    </div>
  </div>
</template>

<style>
    .modal-backdrop {
        position: absolute;
        z-index: 100;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        background: var(--vt-c-white);
        box-shadow: 2px 2px 20px 1px;
        overflow-x: auto;
        display: flex;
        flex-direction: column;
        margin: 20px;
    }

    .modal-header,
    .modal-footer {
        display: flex;
        padding: 20px 10px;
        margin: 20px;
    }

    .modal-header {
        position: relative;
        border-bottom: 2px solid var(--color-text-dark);
        color: var(--color-text-light);
        font-size:20px;
        text-align: center;
    }

    .modal-footer {
        border-top: 2px solid var(--color-text-dark);
        flex-direction: column;
        justify-content: flex-end;
        text-align: center;
    }

    .modal-body {
        position: relative;
        padding: 20px 10px;
        color: red;
        text-align: center;
    }

    .btn-green {
        color: var(--vt-c-white);
        background: hsla(160, 100%, 37%, 1);
        border: 1px solid #4AAE9B;
        border-radius: 2px;
        margin: 20px;
    }
</style>
