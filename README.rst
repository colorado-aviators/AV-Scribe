===========
AVWX Scribe
===========

A web app that makes it easier to transcribe aviation weather data accessed over the radio.

* Free software: MIT license

Disclaimer
----------

*This web app is provided "as is", free of charge, and without any guarantee as to the
utility, accuracy, or sufficiency of the functionality afforded by its use. DO NOT use this app in situations wherein
the failure of its functionality could put your safety or the safety of others at risk. By using this web app, you are
agreeing to use it in a manner that will not conflict with FAA regulations or best practices of aviation.*

Background
----------

The aviation community uses several common frameworks for the efficient encoding, dissemination, and transmission of important
meteorological conditions and for the reporting of salient weather phenomena.
These frameworks include METAR, TAF, AWOS, ASOS, and ATIS, each with a different structure and purpose.
Pilots are required to interpret this information on a regular basis as part of private and commercial operations.

Traditionally, pilots have been expected to receive this information directly via radio transmission,
often equipped with only a `kneeboard <https://www.sportys.com/sporty-s-classic-kneeboard.html>`_ and a pen.
This can be inefficient and cumbersome, leading to increased cognitive load and potential for information loss.
Today, much of this information is actually available online (see `AviationWeather.gov <https://aviationweather.gov/>`_).
However, student pilots are required to learn the manual process of tuning into an ATIS/AWOS/ASOS frequency while inbound
and recording weather information -- along with additional information about airport operations. This is considered an
essential skill because it is still the default when digital sources are not available or reliable.

Features
--------

This app is an evolving project that is not yet feature-complete. Please refer to the `Issues tab <https://github.com/mcgsjoyner/AVWX-Scribe/issues>`_
for a digest of proposed features, enhancements, and bug fixes.

* Facilitates capture of aviation weather data in real time
* Export functionality transcribes captured data to a TXT file download for safe keeping
* Color-based flagging indicates weather factors which could become problematic for general aviation

References
----------

* This video from `Free Pilot Training <https://www.youtube.com/watch?v=0JRVTlLJ7hk>`_ is a good description of ATIS for
  student pilots
* The `METAR article on Wikipedia <https://www.weather.gov/media/wrh/mesowest/metar_decode_key.pdf>`_ provides a
  comprehensive list of abbreviations common to various aviation weather sources
* The `ATIS article on Wikipedia <https://en.wikipedia.org/wiki/Automatic_terminal_information_service>`_ provides a
  brief description of the service along with multiple useful examples
* The FAA has posted `these instructions <https://www.faa.gov/air_traffic/publications/atpubs/atc_html/chap2_section_9.html>`_
  on logistics and phraseology for air traffic controllers responsible for recording and deploying ATIS
* `AviationWeather.gov <https://aviationweather.gov/>`_ provides a digital digest of METAR data for US airports
  (such as `DIA <https://aviationweather.gov/data/metar/?id=KDEN&hours=48>`_)