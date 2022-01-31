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

Do not directly edit `bom_squad/static/index.css` or `bom_squad/static/index.js`. All CSS and Bootstrap is served from the `bom_squad/static/index.css` file, which is compiled from SCSS by Webpack. All ES6 is transpiled to `bom_squad/static/index.js` by the same Webpack config, which has multiple entry point for SCSS and JS files. To edit the SCSS styles you need to run 

```
npm install 
```

in the `bom_squad/static/static_editable/scss` directory, which will download the required `node_modules` folder and install all the dependencies in `bom_squad/static/static_editable/scss/package.json`. You can then compile SCSS and transpile ES6 by running 

```
npx webpack 
```

in the `bom_squad/static/ tatic_editable/scss` directory. 

To edit SCSS files, find or create an appropriate file in the `bom_squad/static/static_editable/scss` directories, and ensure that the file is imported into the `all.scss` file in the same directory. 

To edit miscellaneous JavaSript (as apposed to the React apps which are stored in certain app directories), edit in the `bom_squad/static/static_editable/js` directory. Note that the `package.json` file and `webpack.config.js`, etc. are all in the `/scss/` directory, so you will need to run `npx webpack` in that directory in order to emit the transpiled JavaScript bundle which is loaded from static by the `base.py` template in Django.

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
