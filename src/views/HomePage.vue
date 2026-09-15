<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Contact Manager</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openModal()">
            <ion-icon :icon="addOutline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Search contacts..."
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Contacts</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Empty State -->
      <div v-if="filteredContacts.length === 0" class="empty-state">
        <ion-icon :icon="personOutline" size="large" color="medium"></ion-icon>
        <p>No contacts found.</p>
        <ion-button fill="outline" @click="openModal()">Add First Contact</ion-button>
      </div>

      <!-- Contact List -->
      <ion-list v-else>
        <ion-item-sliding v-for="contact in filteredContacts" :key="contact.id">
          <ion-item>
            <ion-avatar slot="start" class="avatar-bg">
              <span class="avatar-text">{{ contact.name.charAt(0).toUpperCase() }}</span>
            </ion-avatar>
            <ion-label>
              <h2>{{ contact.name }}</h2>
              <p><ion-icon :icon="callOutline" /> {{ contact.phone }}</p>
              <p v-if="contact.email"><ion-icon :icon="mailOutline" /> {{ contact.email }}</p>
              <p v-if="contact.address"><ion-icon :icon="locationOutline" /> {{ contact.address }}</p>
              <ion-badge :color="getCategoryColor(contact.category)" class="ion-margin-top">
                {{ contact.category }}
              </ion-badge>
            </ion-label>
          </ion-item>

          <!-- Swipe Options for Edit / Delete -->
          <ion-item-options side="end">
            <ion-item-option color="primary" @click="openModal(contact)">
              <ion-icon :icon="createOutline" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option color="danger" @click="deleteContact(contact.id)">
              <ion-icon :icon="trashOutline" slot="icon-only"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- Floating Action Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openModal()">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonFab,
  IonFabButton,
  modalController,
  alertController,
} from '@ionic/vue';
import {
  addOutline,
  personOutline,
  callOutline,
  mailOutline,
  locationOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import { Contact } from '@/types/contact';
import ContactModal from '@/components/ContactModal.vue';

const contacts = ref<Contact[]>([]);
const searchQuery = ref('');

onMounted(() => {
  const saved = localStorage.getItem('ionic_contacts');
  if (saved) {
    contacts.value = JSON.parse(saved);
  } else {
   
    contacts.value = [];
  }
});

watch(
  contacts,
  (newVal) => {
    localStorage.setItem('ionic_contacts', JSON.stringify(newVal));
  },
  { deep: true }
);

const filteredContacts = computed(() => {
  return contacts.value.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.phone.includes(searchQuery.value) ||
      c.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Family': return 'success';
    case 'Friends': return 'tertiary';
    case 'Work': return 'warning';
    default: return 'medium';
  }
};

const openModal = async (contactToEdit: Contact | null = null) => {
  const modal = await modalController.create({
    component: ContactModal,
    componentProps: {
      contact: contactToEdit,
    },
  });

  await modal.present();

  const { data, role } = await modal.onDidDismiss();

  if (role === 'confirm' && data) {
    if (contactToEdit) {
      const index = contacts.value.findIndex((c) => c.id === contactToEdit.id);
      if (index !== -1) {
        contacts.value[index] = { ...data, id: contactToEdit.id };
      }
    } else {
      const newContact: Contact = {
        ...data,
        id: Date.now().toString(),
      };
      contacts.value.push(newContact);
    }
  }
};

const deleteContact = async (id: string) => {
  const alert = await alertController.create({
    header: 'Delete Contact',
    message: 'Are you sure you want to delete this contact?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          contacts.value = contacts.value.filter((c) => c.id !== id);
        },
      },
    ],
  });

  await alert.present();
};
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  color: var(--ion-color-medium);
}

.empty-state ion-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.avatar-bg {
  background-color: var(--ion-color-primary-tint);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: var(--ion-color-primary-contrast);
  font-weight: bold;
  font-size: 1.2rem;
}

ion-item p {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 2px 0;
  font-size: 0.9rem;
}
</style>