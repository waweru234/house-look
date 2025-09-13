// Sample data population script for Firebase
// Run this to populate your database with sample data for testing the admin dashboard

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, push } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyCGfRa_Ynua8gtYC-hGPdGC5zqKqO3nods",
  authDomain: "houselook-fd529.firebaseapp.com",
  databaseURL: "https://houselook-fd529-default-rtdb.firebaseio.com",
  projectId: "houselook-fd529",
  storageBucket: "houselook-fd529.appspot.com",
  messagingSenderId: "115183142097",
  appId: "1:115183142097:web:86421e125e5ae230cbf1f0",
  measurementId: "G-KQ00M1SZZM"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Sample users data
const sampleUsers = {
  "user_1": {
    name: "John Kamau",
    email: "john@email.com",
    points: 450,
    role: "property_owner",
    createdAt: "2024-01-15T10:00:00Z",
    lastActive: Date.now(),
    saved: {
      "property_1": true,
      "property_3": true
    }
  },
  "user_2": {
    name: "Mary Wanjiku",
    email: "mary@email.com",
    points: 380,
    role: "tenant",
    createdAt: "2024-02-20T14:30:00Z",
    lastActive: Date.now() - 300000, // 5 minutes ago
    saved: {
      "property_2": true
    }
  },
  "user_3": {
    name: "Peter Ochieng",
    email: "peter@email.com",
    points: 320,
    role: "agent",
    createdAt: "2024-01-08T09:15:00Z",
    lastActive: Date.now() - 600000, // 10 minutes ago
    saved: {}
  },
  "user_4": {
    name: "Grace Akinyi",
    email: "grace@email.com",
    points: 290,
    role: "property_owner",
    createdAt: "2024-03-12T16:45:00Z",
    lastActive: Date.now() - 1800000, // 30 minutes ago
    saved: {
      "property_4": true
    }
  },
  "user_5": {
    name: "David Mwangi",
    email: "david@email.com",
    points: 275,
    role: "tenant",
    createdAt: "2024-02-05T11:20:00Z",
    lastActive: Date.now() - 3600000, // 1 hour ago
    saved: {}
  }
};

// Sample properties data
const sampleProperties = {
  "property_1": {
    title: "Modern Apartment in Westlands",
    price: 85000,
    type: "Apartment",
    location: "Westlands",
    UserID: "user_1",
    bedrooms: 2,
    bathrooms: 2,
    area: "1200 sq ft",
    createdAt: "2024-01-20T10:00:00Z"
  },
  "property_2": {
    title: "Luxury Villa in Karen",
    price: 250000,
    type: "Villa",
    location: "Karen",
    UserID: "user_4",
    bedrooms: 4,
    bathrooms: 3,
    area: "2500 sq ft",
    createdAt: "2024-03-15T14:30:00Z"
  },
  "property_3": {
    title: "Studio Apartment in Kilimani",
    price: 45000,
    type: "Studio",
    location: "Kilimani",
    UserID: "user_1",
    bedrooms: 1,
    bathrooms: 1,
    area: "600 sq ft",
    createdAt: "2024-02-10T09:15:00Z"
  },
  "property_4": {
    title: "Townhouse in Lavington",
    price: 180000,
    type: "Townhouse",
    location: "Lavington",
    UserID: "user_4",
    bedrooms: 3,
    bathrooms: 2,
    area: "1800 sq ft",
    createdAt: "2024-03-20T16:45:00Z"
  },
  "property_5": {
    title: "Penthouse in Upperhill",
    price: 350000,
    type: "Penthouse",
    location: "Upperhill",
    UserID: "user_3",
    bedrooms: 5,
    bathrooms: 4,
    area: "3000 sq ft",
    createdAt: "2024-01-25T11:20:00Z"
  }
};

// Sample transactions data
const sampleTransactions = {
  "transaction_1": {
    userId: "user_1",
    amount: 5000,
    type: "listing_fee",
    description: "Property listing fee for Modern Apartment",
    status: "completed",
    paymentMethod: "M-Pesa",
    reference: "MPESA_001",
    timestamp: Date.now() - 86400000, // 1 day ago
    date: new Date(Date.now() - 86400000).toISOString()
  },
  "transaction_2": {
    userId: "user_4",
    amount: 5000,
    type: "listing_fee",
    description: "Property listing fee for Luxury Villa",
    status: "completed",
    paymentMethod: "M-Pesa",
    reference: "MPESA_002",
    timestamp: Date.now() - 172800000, // 2 days ago
    date: new Date(Date.now() - 172800000).toISOString()
  },
  "transaction_3": {
    userId: "user_3",
    amount: 5000,
    type: "listing_fee",
    description: "Property listing fee for Penthouse",
    status: "completed",
    paymentMethod: "M-Pesa",
    reference: "MPESA_003",
    timestamp: Date.now() - 259200000, // 3 days ago
    date: new Date(Date.now() - 259200000).toISOString()
  },
  "transaction_4": {
    userId: "user_1",
    amount: 5000,
    type: "listing_fee",
    description: "Property listing fee for Studio Apartment",
    status: "completed",
    paymentMethod: "M-Pesa",
    reference: "MPESA_004",
    timestamp: Date.now() - 345600000, // 4 days ago
    date: new Date(Date.now() - 345600000).toISOString()
  },
  "transaction_5": {
    userId: "user_4",
    amount: 5000,
    type: "listing_fee",
    description: "Property listing fee for Townhouse",
    status: "completed",
    paymentMethod: "M-Pesa",
    reference: "MPESA_005",
    timestamp: Date.now() - 432000000, // 5 days ago
    date: new Date(Date.now() - 432000000).toISOString()
  }
};

async function populateSampleData() {
  try {
    console.log('🚀 Starting to populate sample data...');
    
    // Populate users
    console.log('📝 Adding sample users...');
    await set(ref(db, 'users'), sampleUsers);
    
    // Populate properties
    console.log('🏠 Adding sample properties...');
    await set(ref(db, 'property'), sampleProperties);
    
    // Populate transactions
    console.log('💰 Adding sample transactions...');
    await set(ref(db, 'transactions'), sampleTransactions);
    
    console.log('✅ Sample data populated successfully!');
    console.log('📊 You can now view the admin dashboard with real data.');
    
  } catch (error) {
    console.error('❌ Error populating sample data:', error);
  }
}

// Run the population script
populateSampleData(); 