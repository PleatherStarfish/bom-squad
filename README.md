![wide_logo](https://user-images.githubusercontent.com/10040486/147892285-e1b955cf-0916-4c57-92c5-ba0a21d1e6ba.png)

# An inventory and search tool for DIY Eurorack synthesizer modules and components

Bom-Squad is a tool to help users source components for DIY SMT Eurorack modules. It allows users to 
-	search modules 
-	add modules to a personal inventory of built or "to build" modules
-	catalog components required for their “to-build” list
-	easily source components from Tayde, Mouser, and other online retailers
-	track a personal inventory of components
-	and version a personal inventory as changes are made, ensuring that mistakes are rare and easily fixed
 
## Getting started

### Installing dependencies

The site is built using [Django](https://www.djangoproject.com/). In order to get your development environment set up, first ensure you have Python installed (version 3.8 or higher **\<TBC\>**), and run the following commands in the directory where you have cloned this repository:

```
python -m pip install -r requirements.txt
```

You will also need to [download Bootstrap 5.0.2](https://getbootstrap.com/docs/5.0/getting-started/download/) and extract the contents to `bom_squad/static`. You should now have `css` and `js` directories in `bom_squad/static/bootstrap-5.0.2-dist`.

### Preparing your environment

Copy the files from `_prereqs` into `bom_squad/secrets`. In each file, replace the redacted API keys with your own API keys. (**TODO: issue [#9](https://github.com/PleatherStarfish/bom-squad/issues/9) needs to be done so that this is true for all secrets**)

Now, create your local database by running:

```
python manage.py migrate
```

Finally, run the app with:

```
python manage.py runserver
```

### Creating a local admin user

Run the following command and follow the instructions to create an admin user:

```
python manage.py createsuperuser
```

You can now access the admin console at `http://127.0.0.1:8000/admin`.
