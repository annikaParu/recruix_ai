# Google sign-in setup (Supabase)

Google sign-in is **handled by Supabase**, not by the Recruix backend. You only need to enable it in the Supabase Dashboard and in Google Cloud.

## 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
4. If asked, configure the **OAuth consent screen** (external user type is fine for testing).
5. Application type: **Web application**.
6. Under **Authorized redirect URIs**, add:
   - `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback`
   - Replace `<YOUR-PROJECT-REF>` with your Supabase project ref (from Supabase Dashboard → Settings → General → Reference ID).
7. Copy the **Client ID** and **Client secret**.

## 2. Supabase Dashboard

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. **Authentication** → **Providers** → **Google**.
3. Turn **Enable Google provider** on.
4. Paste the **Client ID** and **Client secret** from Google Cloud.
5. Save.

## 3. Redirect URLs (Supabase)

1. In the same project: **Authentication** → **URL Configuration**.
2. Under **Redirect URLs**, add (one per line):
   - `http://localhost:5173/auth/callback`
   - `http://localhost:5174/auth/callback`
   - `http://localhost:5175/auth/callback`
   - (and your production URL when you deploy, e.g. `https://yourapp.com/auth/callback`)
3. Save.

## 4. Test

- On the app, open **Sign in** or **Sign up**.
- Click **Continue with Google**.
- You should be sent to Google, then back to the app and logged in.

If you see an error like "Provider is not enabled" or "Invalid redirect URL", double-check that the Google provider is enabled and that your app’s URL is in the Redirect URLs list.

---

**About “Invalid username or password” and “Check your email”**

- **Invalid username or password** appears when you use the **email + password** form and the email or password is wrong, or no account exists for that email. Use **Continue with Google** to sign in with Google instead.
- **Check your email** appears only after you **create an account** with email/password. Supabase may require new users to confirm their email before they can sign in. If you only want to use Google, ignore the email form and use **Continue with Google** only.
