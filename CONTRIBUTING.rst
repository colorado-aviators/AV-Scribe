.. highlight:: shell
.. |repo| replace:: AVWX Scribe
.. |plug| replace:: avwx-scribe

============
Contributing
============

Contributions are welcome, and they are greatly appreciated! Every little bit
helps, and credit will always be given.

You can contribute in many ways:

Types of Contributions
----------------------

Report Bugs
~~~~~~~~~~~

Report bugs at https://github.com/mcgsjoyner/AVWX-Scribe/issues.

If you are reporting a bug, please include:

* Your operating system name and version.
* Any details about your local setup that might be helpful in troubleshooting.
* Detailed steps to reproduce the bug.

Fix Bugs
~~~~~~~~

Look through the GitHub issues for bugs. Anything tagged with "bug" and "help
wanted" is open to whoever wants to implement it.

Implement Features
~~~~~~~~~~~~~~~~~~

Look through the GitHub issues for features. Anything tagged with "enhancement"
and "help wanted" is open to whoever wants to implement it.

Write Documentation
~~~~~~~~~~~~~~~~~~~

|repo| could always use more documentation, whether as part of the
official |repo| docs, in docstrings, or even on the web in blog posts,
articles, and such.

Submit Feedback
~~~~~~~~~~~~~~~

The best way to send feedback is to file an issue at https://github.com/mcgsjoyner/AVWX-Scribe/issues.

If you are proposing a feature:

* Explain in detail how it would work.
* Keep the scope as narrow as possible to make it easier to implement.
* Remember that this is a volunteer-driven project, and that contributions
  are welcome :)

Engineering procedures
----------------------

Release Process
~~~~~~~~~~~~~~~

1.  Elect a version name for the next release according to `Semver <https://semver.org>`_.
    Let's pretend we're staging a minor release from ``v0.1.0`` to ``v0.2.0``...
2.  Check out a release branch from ``main``:

    .. code-block:: shell

        git checkout main && git pull
        git checkout -b release/v0.2.0

3.  Bump the version of the repo:

    .. code-block:: shell

        npm version minor

4.  Update the HISTORY file based on the issues closed since the last release.
5.  Commit your changes:

    .. code-block:: shell

        git commit -am "update release docs" && git push

6.  Open and merge a pull request from your branch onto main with the title "Release v0.2.0".

Get Started!
------------

Ready to contribute? Here's how to set up |plug| for local development.

1.  Fork the |plug| repo on GitHub.
2.  Clone your fork locally:

    .. code-block:: shell

        git clone git@github.com:your_name_here/avwx-scribe.git

3.  Install your local copy:

    .. code-block:: shell

        cd avwx-scribe/
        npm install

4.  Create a branch for local development:

    .. code-block:: shell

        git checkout -b name-of-your-bugfix-or-feature

    Now you can make your changes locally.

5.  Commit your changes and push your branch to GitHub:

    .. code-block:: shell

        git add .
        git commit -m "Your detailed description of your changes."
        git push origin name-of-your-bugfix-or-feature

6. Submit a pull request through the GitHub website.
