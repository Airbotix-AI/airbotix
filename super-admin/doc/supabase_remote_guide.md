## 🔄 Supabase Collaborative Development Workflow

### **1. Environment Setup**

```bash
# Install Supabase CLI
brew install supabase/tap/supabase   # or npm install -g supabase
```

💡 **Tips**

* `supabase start` can launch the full local Supabase environment (PostgreSQL + Auth + Storage)
* Keep the CLI version consistent across team members to avoid SQL syntax or feature differences
* Local service requires Docker; make sure Docker Desktop is running

---


### **2. Login to Supabase CLI and Link Remote Project**

```bash
# Login to Supabase CLI (opens a browser to enter credentials)
supabase login

# Link remote project
supabase link --project-ref your-project-ref
```

💡 **Notes**

* `your-project-ref` can be found in Supabase Console → Project Settings → API → Project Reference
* After login, `supabase/config.toml` will save the remote project reference locally
* Alternatively, you can set the environment variable `SUPABASE_ACCESS_TOKEN` for automatic login

💡 **Current Project Info**

* The configured database for this project is in the Airbotix AI workspace
* Database name: `super-admin-test`
* All migrations and remote operations should target this database

---

### **3. Local Supabase Setup for New Developers**

* If you are the first time working on this project and do not have a `supabase/` folder locally, run:

```bash
supabase init
````

* Otherwise, just pull the main branch and run `supabase db reset`

---

### **4. Start Local Supabase Service**

```bash
supabase start
```

* Starts local Docker environment including PostgreSQL, Auth, and Storage
* Only after starting the service can you run `supabase db reset` and other database operations

💡 **Tips**

* Stop local service with:

```bash
supabase stop
```

---

### **5. Before Each Development Session**

```bash
git pull origin main       # Pull the latest code
supabase db reset          # Reset local database and apply all migrations
```

💡 **Tips**

* Name local development branches using a standard convention: `feature/xxx` or `bugfix/xxx`
* Always pull the latest main and reset your local database to avoid schema inconsistencies

---

### **6. Modifying the Database During Development**

* Do **not** modify tables directly in the Supabase Console
* Correct approach:

```bash
supabase migration new <action>_<object>
```

* Write your table/column modifications in the generated SQL file
* Commit the migration file along with your code

💡 **Tips**

* Migration files naming convention: `YYYYMMDDHHMMSS_action_description.sql`
* Each migration file should handle only **one change** (create table, modify column, drop table)
* If multiple people need to modify the same table, create separate migration files applied in order

---

### **7. Commit Code & Merge**

* Write your code and include migration files
* Before submitting a PR, run:

```bash
supabase db reset
```

* Make sure all migrations execute successfully

- Team Code Review for migration files to avoid conflicts or duplicate tables

💡 **Notes**

* Check SQL compatibility: avoid syntax that only works in a specific Supabase CLI version
* If conflicts arise, do **not** manually modify the remote database; resolve via migration files

---

### **8. Deploy to Remote Supabase**

* Recommended: only execute on **main branch after merge**, via CI/CD or a designated person:

```bash
supabase db push
```

* Ensures the remote database schema is always updated through migrations

💡 **Tips**

* CI/CD can automatically run `supabase db push` after PR merge
* GitHub Actions or GitLab CI can be configured for deployment

---

### **9. Handling Conflicts**

* If two people modify the same schema at the same time, migration files may conflict
* Resolution: keep both migration files in time order so the database can apply them sequentially

💡 **Notes**

* When multiple people modify the same table columns, coordinate or mark the order in PR
* On migration conflicts, reset local database and apply all migrations sequentially

---

✨ **Final Outcome**

* Each team member can develop locally without affecting others
* Database schema changes are versioned via migrations
* Remote Supabase database remains clean and reproducible
* Team collaboration is structured, minimizing conflicts and duplicate work