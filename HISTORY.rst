.. |repo| replace:: AV Scribe
.. |bug| replace:: **Bug Fixes**
.. |feat| replace:: **Features Added**
.. |refactor| replace:: **Notable Refactors**
.. |test| replace:: **Testing**
.. |doc| replace:: **Documentation**
.. |ui| replace:: **UI Updates**

=======
History
=======

0.5.0 (2024-08-01)
------------------
Significant UI redesign for ease of use.

|ui|
* Standardize the input grid by making each entry field full-width and uniformly spaced.
* Convert field elevation to a number entry input and wind condition to a dropdown.
* Standardize coloring of text fields and ensure font color changes when first interacted with.
* Migrate disclaimer to a modular and use a 30-day cookie to block its reappearance.

|bug|
* Exclude null values, and their keys, from the transcript.

|refactor|
* Use style classes to unify input components.

0.4.0 (2024-07-29)
------------------
Makes a few UI improvements.

|ui|
* Add increment buttons to slider.
* Use dark blue to indicate untouched values.
* Add version number to the app.

|refactor|
* Refactor all sliders to inherit from a common component.

|test|
* Use latest GitHub Action versions in CI and CD.

0.3.1 (2024-07-28)
------------------
Fixes TypeScript errors and adds type-checking to CI (whoops).

0.3.0 (2024-07-28)
------------------
Implements new input fields, improves the general UI and the transcript,
and provides a density altitude estimation.

|bug|
* Apply rounding directly to values, rather than on text output alone.
* Render transcript as an HTML file, fixing TXT-based degree symbol issues.
* Make the ATIS time default to NOW in the transcript.

|feat|
* Implement density altitude estimation.

|ui|
* Add field elevation selection for the density altitude estimation.
* Add cloud coverage and ceiling inputs.
* Disable, rather than hide, input fields that are rendered meaningless by other inputs.

|doc|
* Document release process.

|refactor|
* Define emits and style objects in the component setup scripts.

|test|
* Create a few tests for physics equations related to density altitude.
* Unblock type checking and resolve all related errors.

0.2.0 (2024-07-25)
------------------
Converts web app to Vue.js with Vite.

|feat|
* Make web app available offline via cache.

|ui|
* Implement dark theme (for flying at night!).
* Increase slider size.
* Increase margin between components.

|refactor|
* Use Vue.js components to build web app.
* Use Vite to deploy.

|test|
* Run a very simple initial test using Vite.
* Implement CI and CD.

0.1.0 (2024-01-10)
------------------
Represents the initial build of |repo| functionality. Not feature complete, but ready for initial feedback.
