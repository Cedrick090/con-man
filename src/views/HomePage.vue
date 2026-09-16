<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Contact Manager</ion-title>

        <ion-buttons slot="end">
          <ion-button @click="openModal()">
            <ion-icon
              :icon="addOutline"
              slot="icon-only"
            ></ion-icon>
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
          <ion-title size="large">
            Contacts
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Loading -->
      <div v-if="loading" class="empty-state">
        <ion-spinner></ion-spinner>
        <p>Loading contacts...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredContacts.length === 0"
        class="empty-state"
      >
        <ion-icon
          :icon="personOutline"
          size="large"
          color="medium"
        ></ion-icon>

        <p>No contacts found.</p>

        <ion-button
          fill="outline"
          @click="openModal()"
        >
          Add First Contact
        </ion-button>
      </div>

      <!-- Contact List -->
      <ion-list v-else>

        <ion-item-sliding
          v-for="contact in filteredContacts"
          :key="contact.id"
        >

          <ion-item>

            <ion-avatar
              slot="start"
              class="avatar-bg"
            >
              <span class="avatar-text">
                {{
                  contact.name
                    ? contact.name.charAt(0).toUpperCase()
                    : '?'
                }}
              </span>
            </ion-avatar>

            <ion-label>

              <h2>
                {{ contact.name }}
              </h2>

              <p v-if="contact.phone">
                <ion-icon :icon="callOutline" />
                {{ contact.phone }}
              </p>

              <p v-if="contact.email">
                <ion-icon :icon="mailOutline" />
                {{ contact.email }}
              </p>

              <p v-if="contact.address">
                <ion-icon :icon="locationOutline" />
                {{ contact.address }}
              </p>

              <ion-badge
                v-if="contact.category"
                :color="getCategoryColor(contact.category)"
                class="ion-margin-top"
              >
                {{ contact.category }}
              </ion-badge>

            </ion-label>

          </ion-item>

          <!-- Swipe Actions -->
          <ion-item-options side="end">

            <!-- UPDATE -->
            <ion-item-option
              color="primary"
              @click="openModal(contact)"
            >
              <ion-icon
                :icon="createOutline"
                slot="icon-only"
              ></ion-icon>
            </ion-item-option>

            <!-- DELETE -->
            <ion-item-option
              color="danger"
              @click="deleteContact(contact.id)"
            >
              <ion-icon
                :icon="trashOutline"
                slot="icon-only"
              ></ion-icon>
            </ion-item-option>

          </ion-item-options>

        </ion-item-sliding>

      </ion-list>

      <!-- Floating Add Button -->
      <ion-fab
        vertical="bottom"
        horizontal="end"
        slot="fixed"
      >
        <ion-fab-button @click="openModal()">
          <ion-icon :icon="addOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">

import {
  ref,
  computed,
  onMounted,
  onUnmounted
} from 'vue';


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
  IonSpinner,
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


import type { Contact } from '@/types/contact';

import ContactModal
  from '@/components/ContactModal.vue';


// =====================================
// FIREBASE
// =====================================

import { db } from '@/firebase';


import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from 'firebase/firestore';


// =====================================
// VARIABLES
// =====================================

const contacts = ref<Contact[]>([]);

const searchQuery = ref('');

const loading = ref(true);


// =====================================
// READ
// GET CONTACTS FROM FIRESTORE
// =====================================

let unsubscribe: (() => void) | null = null;


onMounted(() => {

  unsubscribe = onSnapshot(

    collection(db, 'contacts'),

    (snapshot) => {

      contacts.value = snapshot.docs.map(
        (document) => {

          const data = document.data();

          return {

            id: document.id,

            name:
              data.name || '',

            phone:
              data.phone || '',

            email:
              data.email || '',

            address:
              data.address || '',

            category:
              data.category || '',

          };

        }
      ) as Contact[];

      loading.value = false;

    },

    (error) => {

      console.error(
        'Error loading contacts:',
        error
      );

      loading.value = false;

    }

  );

});


// Stop Firebase listener
onUnmounted(() => {

  if (unsubscribe) {

    unsubscribe();

  }

});


// =====================================
// SEARCH
// =====================================

const filteredContacts = computed(() => {

  const query =
    searchQuery.value
      .toLowerCase()
      .trim();


  if (!query) {

    return contacts.value;

  }


  return contacts.value.filter(
    (contact) =>

      contact.name
        .toLowerCase()
        .includes(query)

      ||

      contact.phone
        .toLowerCase()
        .includes(query)

      ||

      contact.category
        .toLowerCase()
        .includes(query)

      ||

      contact.email
        ?.toLowerCase()
        .includes(query)

      ||

      contact.address
        ?.toLowerCase()
        .includes(query)

  );

});


// =====================================
// CATEGORY COLORS
// =====================================

const getCategoryColor = (
  category: string
) => {

  switch (category) {

    case 'Family':

      return 'success';


    case 'Friends':

      return 'tertiary';


    case 'Work':

      return 'warning';


    default:

      return 'medium';

  }

};


// =====================================
// CREATE AND UPDATE
// =====================================

const openModal = async (
  contactToEdit: Contact | null = null
) => {

  const modal =
    await modalController.create({

      component: ContactModal,

      componentProps: {

        contact: contactToEdit

      }

    });


  await modal.present();


  const { data, role } =
    await modal.onDidDismiss();


  if (
    role !== 'confirm'
    ||
    !data
  ) {

    return;

  }


  try {

    // =================================
    // UPDATE CONTACT
    // =================================

    if (contactToEdit) {

      const contactReference =
        doc(
          db,
          'contacts',
          contactToEdit.id
        );


      await updateDoc(
        contactReference,
        {

          name:
            data.name || '',

          phone:
            data.phone || '',

          email:
            data.email || '',

          address:
            data.address || '',

          category:
            data.category || ''

        }
      );


      console.log(
        'Contact updated successfully'
      );

    }


    // =================================
    // CREATE CONTACT
    // =================================

    else {

      await addDoc(

        collection(
          db,
          'contacts'
        ),

        {

          name:
            data.name || '',

          phone:
            data.phone || '',

          email:
            data.email || '',

          address:
            data.address || '',

          category:
            data.category || ''

        }

      );


      console.log(
        'Contact added successfully'
      );

    }

  }

  catch (error) {

    console.error(
      'Error saving contact:',
      error
    );


    const alert =
      await alertController.create({

        header: 'Error',

        message:
          'Unable to save contact to Firebase.',

        buttons: ['OK']

      });


    await alert.present();

  }

};


// =====================================
// DELETE
// =====================================

const deleteContact = async (
  id: string
) => {

  const alert =
    await alertController.create({

      header:
        'Delete Contact',

      message:
        'Are you sure you want to delete this contact?',

      buttons: [

        {

          text:
            'Cancel',

          role:
            'cancel'

        },

        {

          text:
            'Delete',

          role:
            'destructive',

          handler:
            async () => {

              try {

                await deleteDoc(

                  doc(
                    db,
                    'contacts',
                    id
                  )

                );


                console.log(
                  'Contact deleted successfully'
                );

              }

              catch (error) {

                console.error(
                  'Error deleting contact:',
                  error
                );

              }

            }

        }

      ]

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

  color:
    var(--ion-color-medium);

}


.empty-state ion-icon {

  font-size: 64px;

  margin-bottom: 16px;

}


.empty-state ion-spinner {

  margin-bottom: 16px;

}


.avatar-bg {

  background-color:
    var(--ion-color-primary-tint);

  display: flex;

  align-items: center;

  justify-content: center;

}


.avatar-text {

  color:
    var(--ion-color-primary-contrast);

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