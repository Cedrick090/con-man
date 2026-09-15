<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>{{ contact ? 'Edit Contact' : 'New Contact' }}</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="dismiss">Cancel</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <form @submit.prevent="saveContact">
      <ion-item>
        <ion-input
          label="Full Name"
          label-placement="stacked"
          v-model="form.name"
          placeholder="Enter name"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-input
          label="Phone Number"
          label-placement="stacked"
          type="tel"
          v-model="form.phone"
          placeholder="Enter phone number"
          required
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-input
          label="Email Address"
          label-placement="stacked"
          type="email"
          v-model="form.email"
          placeholder="Enter email address"
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-textarea
          label="Address"
          label-placement="stacked"
          v-model="form.address"
          placeholder="Enter physical address"
          :rows="2"
        ></ion-textarea>
      </ion-item>

      <ion-item>
        <ion-select
          label="Category / Relationship"
          label-placement="stacked"
          v-model="form.category"
          placeholder="Select relationship"
        >
          <ion-select-option value="Family">Family</ion-select-option>
          <ion-select-option value="Friends">Friends</ion-select-option>
          <ion-select-option value="Work">Work</ion-select-option>
          <ion-select-option value="Other">Other</ion-select-option>
        </ion-select>
      </ion-item>

      <div class="ion-margin-top">
        <ion-button expand="block" type="submit">
          {{ contact ? 'Update Contact' : 'Save Contact' }}
        </ion-button>
      </div>
    </form>
  </ion-content>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  modalController,
} from '@ionic/vue';
import { Contact } from '@/types/contact';

const props = defineProps<{
  contact?: Contact | null;
}>();

const form = ref<Omit<Contact, 'id'>>({
  name: '',
  phone: '',
  email: '',
  address: '',
  category: 'Friends',
});

watch(
  () => props.contact,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  },
  { immediate: true }
);

const dismiss = () => {
  modalController.dismiss();
};

const saveContact = () => {
  if (!form.value.name || !form.value.phone) return;
  modalController.dismiss(form.value, 'confirm');
};
</script>