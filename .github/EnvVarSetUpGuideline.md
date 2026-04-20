# Environment Variables Setup Guidelines

This document provides a step-by-step guide to setting up the required `.env` files for both the frontend and backend. These variables are essential for the application to function properly.

---

## **Backend `.env` Variables**

1. **`DBURL (Mongo URL)`**

   - **Description:** The MongoDB connection string.
   - **How to Obtain:**

     1. Go to MongoDB Atlas and sign up or log in.
     2. Create a new cluster if you don't have one already.
     3. Navigate to Database Access and create a new database user with the appropriate permissions (e.g., readWrite).
     4. In the Network Access tab, allow connections from your IP address (or use 0.0.0.0/0 for all IPs for testing).
     5. Go to Clusters, click on Connect, and select Connect your application.
     6. Copy the connection string provided (it should look like `mongodb+srv://<username>: <password>@cluster0.mongodb.net/test?retryWrites=true&w=majority`).
     7. Replace <username> and <password> with the credentials you created in step 3.
     8. Set the DBURL variable in your env file with the full MongoDB Atlas URL.

     For a local MongoDB setup, you can install MongoDB locally and use
     `mongodb://localhost:27017/your-database-name`

2. **`HOST_EMAIL (NodeMailer)`**

   - **Description:** The email used as the sender in NodeMailer.
   - **How to Obtain:**

     1. Go to Google's App Passwords.
     2. Select Mail as the app and Other as the device.
     3. Generate a new password and copy it.
     4. Set HOST_EMAIL to your email address (e.g., youremail@gmail.com) and PASSWORD to the generated app password.

     ```
     HOST_EMAIL=youremail@gmail.com
     PASSWORD=your_app_password
     PORT=587
     ```

3. **`STRIPE_SECRET_KEY`**

   - **Description:** The app password for the email account used with NodeMailer.
   - **How to Obtain:**

     1. Go to Stripe Dashboard.
     2. In the Developers section, find API keys.
     3. Copy the Secret Key (start with sk*test* for test environments).
     4. Set the STRIPE_SECRET_KEY in the env file.

     `STRIPE_SECRET_KEY=your_stripe_secret_key`

4. **`DOMAIN (Backend Server after Deployment)`**

   - **Description:** This is the domain where your backend will be hosted. If you're deploying to a platform like Heroku, Vercel, or any cloud service, use the public domain provided.

   For example:

   `DOMAIN=https://yourdomain.com`

5. **`SECRET (JWT Secret for Encryption)`**

   - **Description:** This is a secret key used for encoding JWT tokens. You can generate a random string using a tool like [Random.org](https://www.random.org) or by using Node.js:

   `require('crypto').randomBytes(64).toString('hex');`

   Set this in your `.env` file:

   `SECRET=your_secret_key`

6. **`TWILIO_WHATSAPP_ACCOUNT_SID`**

   - **Description:** The Account SID (unique identifier) for your Twilio account.
   - **How to Obtain:**

     1. Log in to your [Twilio Console](https://console.twilio.com/).
     2. On the Account Dashboard, go to the **For You** tab.
     3. Scroll down to the **Account Info** section to find your Account SID.
     4. Copy the Account SID and set it as `TWILIO_WHATSAPP_ACCOUNT_SID` in your `.env` file.

     `TWILIO_WHATSAPP_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

7. **`TWILIO_WHATSAPP_AUTH_TOKEN`**

   - **Description:** The authentication token used to verify and authenticate requests to Twilio.
   - **How to Obtain:**

     1. Log in to your [Twilio Console](https://console.twilio.com/).
     2. On the Account Dashboard, go to the **For You** tab.
     3. Scroll down to the **Account Info** section.
     4. Click on the show icon to reveal the Auth Token.
     5. Copy the token and set it as `TWILIO_WHATSAPP_AUTH_TOKEN` in your `.env` file.

     `TWILIO_WHATSAPP_AUTH_TOKEN=your_auth_token`

8. **`TWILIO_WHATSAPP_FROM`**

   - **Description:** The Twilio WhatsApp-enabled phone number used to send messages.
   - **How to Obtain:**

     1. Log in to your [Twilio Console](https://console.twilio.com/).
     2. In the Twilio Console, go to the **Develop Tab**.
     3. Navigate to **Messaging → Try it Out → Send WhatsApp Message**.
     4. To enable the WhatsApp Sandbox for testing follow the provided instructions to send a test message to Twilio's sandbox number and verify your phone for sandbox use.
     5. Twilio will send a WhatsApp-enabled sandbox number to your WhatsApp in the format `whatsapp:+1234567890`.
     6. Copy the number and set it as `TWILIO_WHATSAPP_FROM` in your `.env` file.

     `TWILIO_WHATSAPP_FROM=whatsapp:+1234567890`

   - Optional steps(To verify your sandbox participants):
     1. In the Twilio Console - **Develop Tab**, navigate to **Messaging → Try it Out → Send WhatsApp Message**.
     2. Under the **Sandbox Settings** tab, scroll to **Sandbox Participants** to view all numbers registered in the sandbox.

9. **`FIREBASE_GOOGLE_AUTH`**

   - **Description:** This JSON object contains authentication credentials required for Firebase's Google authentication provider in the backend. It is used to authenticate and authorize API requests securely.

   - **How to Obtain:**

     1. **Go to Firebase Console:**

        - Visit [Firebase Console](https://console.firebase.google.com/).
        - Select your project or create a new one (Keep the all options furthur default)

     2. **Navigate to Service Accounts:**

        - In the left sidebar, go to **Project Overview** and click on the **Settings** (⚙️) icon.
        - Select the **Service Accounts** tab.

     3. **Generate Private Key:**

        - Under the **Firebase Admin SDK** section, click on **Generate new private key**.
        - A JSON file will be downloaded to your system.

     4. **Set Environment Variables:**
        - Open the downloaded JSON file and add each value from it one at a time to your `.env` file, following this format:
        - **Note:** The entire JSON object should be wrapped as a string under the variable `FIREBASE_GOOGLE_AUTH` in your `.env` file.

     ```
      FIREBASE_TYPE=service_account
      FIREBASE_PROJECT_ID=your-project-id
      FIREBASE_PRIVATE_KEY_ID=your-private-key-id
      FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\\nyour-private-key\\n-----END PRIVATE KEY-----\\n
      FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
      FIREBASE_CLIENT_ID=your-client-id
      FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
      FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
      FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
      FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com
      FIREBASE_UNIVERSE_DOMAIN=googleapis.com

     ```

11. **`CLOUDINARY_CLOUD_NAME`**

- **Description:** Your unique Cloudinary cloud name used to identify your account.
- **How to Obtain:**

  1. Log in to your [Cloudinary Account](https://cloudinary.com/).
  2. Click on the **Settings** icon in the bottom-left corner.
  3. In the left panel, select the **API Keys** tab.
  4. Locate the **Cloud Name** field.
  5. Copy the **Cloud Name** and set it in your `.env` file:

     ```
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     ```

12. **`CLOUDINARY_API_KEY`**

- **Description:** A unique API key used to authenticate requests to Cloudinary.
- **How to Obtain:**

  1. Log in to your [Cloudinary Account](https://cloudinary.com/).
  2. Click on the **Settings** icon in the bottom-left corner.
  3. In the left panel, select the **API Keys** tab.
  4. If no API key is present, click **Generate New API Key**.
  5. Copy the **API Key** and set it in your `.env` file:

     ```
     CLOUDINARY_API_KEY=your-api-key
     ```

13. **`CLOUDINARY_API_SECRET`**

- **Description:** A private API secret used for secure authentication with Cloudinary services.
- **How to Obtain:**

  1. Log in to your [Cloudinary Account](https://cloudinary.com/).
  2. Click on the **Settings** icon in the bottom-left corner.
  3. In the left panel, select the **API Keys** tab.
  4. Copy the corresponding  **API Secret** to your API Key and set it in your `.env` file:

     ```
     CLOUDINARY_API_SECRET=your-api-secret
     ```
     
   #### **Storing PDF and ZIP Files on Cloudinary**  

   By default, Cloudinary does not allow storing **PDF and ZIP files** unless explicitly permitted. Follow these steps to enable this feature:  

   1. Log in to your [Cloudinary Account](https://cloudinary.com/).  
   2. Click on the **Settings** icon in the bottom-left corner.  
   3. In the left panel, select the **Security** tab.  
   4. Scroll down to the last section labeled **"PDF and ZIP files delivery"**.  
   5. **Check** the option and **save** changes.  

   Once enabled, you will be able to **upload and store PDF and ZIP files** in Cloudinary.

14. **`GEMINI_API_KEY`**

- **Description:** The API key for Report Analyzing 
- **How to Obtain:**
   1. Go to the [Google AI Studio](https://aistudio.google.com/app/apikey).
   2. Sign in with your Google account.
   3. Once logged in, you should see an interface for managing projects and API keys (If prompted, create a new project or select an existing one).
   4. Now In the API Key section, look for an option to Generate API Key & click on it to create a new API key
   5. Once the key is generated, it will be displayed on the screen.
   6. Copy the API key.
   7. Open your `.env` file in frontend folder.
   8. Replacing `your_api_key` with the key you copied:
      `GEMINI_API_KEY = your_API_key`
---

## **Frontend `.env` Variables**

1. **`VITE_PUBLICATION_KEY`**

   - **Description:** The public Stripe key for client-side payment processing.
   - **How to Obtain:**

     1. Log in to the [Stripe dashboard](https://dashboard.stripe.com/).
     2. Navigate to the Developers section.
     3. Click on API Keys.
     4. Copy the Publishable Key (starts with pk*test* for test environments).
     5. Set the VITE_PUBLICATION_KEY variable in your env file with the copied key.

     `VITE_PUBLICATION_KEY=your_stripe_publishable_key`

2. **`VITE_JAAS_APP_ID`**

   - **Description:** The key for integrating Jitsi Meet video conferencing.
   - **How to Obtain:**

     1. Go to the [Jitsi developer portal](https://jaas.8x8.vc/).
     2. Sign up or log in to your account.
     3. Navigate to the API section.
     4. Create a new application if you don't have one.
     5. Copy the App ID provided.
     6. Set the VITE_JAAS_APP_ID variable in your env file with the copied App ID.

     `VITE_JAAS_APP_ID=your_jaas_app_id`

3. **`VITE_API_KEY`**

   - **Description:** The API key for Chat-Bot
   - **How to Obtain:**
     1. Go to the [Google AI Studio](https://aistudio.google.com/app/apikey).
     2. Sign in with your Google account.
     3. Once logged in, you should see an interface for managing projects and API keys (If prompted, create a new project or select an existing one).
     4. Now In the API Key section, look for an option to Generate API Key & click on it to create a new API key
     5. Once the key is generated, it will be displayed on the screen.
     6. Copy the API key.
     7. Open your `.env` file in frontend folder.
     8. Replacing `your_api_key` with the key you copied:
        `VITE_API_KEY = your_API_key`

4. **`VITE_FIREBASE_CONFIG`**

   - **Description:** These credentials allow the frontend to interact with Firebase services, such as authentication and Firestore.

   - **How to Obtain:**

     1. **Go to Firebase Console:**

        - Visit [Firebase Console](https://console.firebase.google.com/).
        - Select your project.

     2. **Add a Web App (if not added already):**

        - In the **Project Overview**, click on the **</> Web** icon to add a new web app.
        - Follow the setup instructions provided by Firebase to configure your web app.
        - **Do not select Firebase Hosting** during the setup process.

     3. **Find Firebase Configurations:**

        - After setting up the web app, click on the **Project Overview Settings** (⚙️) icon in the left sidebar.
        - Scroll down to the **Your Apps** section under "General".
        - Click on your web app (or create one if not already added).

     4. **Copy the Firebase Configuration Object:**

        - Locate the **Firebase SDK snippet** and copy the `firebaseConfig` object values.

     5. **Set Environment Variables:**
        - Add each value from the `firebaseConfig` one at a time to your `.env` file in the following format:
        - **Note:** The entire `firebaseConfig` object should be wrapped as a string under the variable `VITE_FIREBASE_CONFIG` in your `.env` file.

     ```
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
     ```

     6. **Enabling Authentication**
        - On your project console, left side bar click on `Authetication` & enable with google (email/password)
        - Give your project name(your choice) & support email, then click save.

---

### **Important Notes**

- Always keep `.env` files private and do not expose them in version control systems like GitHub.
- Use environment variable management tools like `dotenv` in development or configure the deployment environment with these variables.
- Ensure secure storage and limited access to keys, passwords, and tokens.

---
