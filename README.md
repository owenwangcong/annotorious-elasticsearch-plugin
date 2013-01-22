# Annotorious ElasticSearch Plugin

An simple [Annotorious](http://github.com/annotorious/annotorious) plugin that stores annotations on an 
[ElasticSearch](http://www.elasticsearch.org/) server. This plugin is meant primarily for demo purposes, and
as an example for those interested in building their own storage plugins. I strongly advise against using 
this plugin in any kind of production environment. (Contributions to make it production ready are always 
welcome though ;-)

This plugin is licensed under the [WTFPL](http://en.wikipedia.org/wiki/WTFPL).

## Using this Plugin

The plugin is located in the _src_ folder of the project. Simply [download the script](https://raw.github.com/annotorious/annotorious-elasticsearch-plugin/master/src/anno-elasticsearch-plugin.js),
copy it to your server/Webspace and set it up with your page as described below.

1. This plugin uses jQuery - therefore you need to import jQuery into your page, before importing the plugin script.
2. Add the plugin script to your page just like any other Annotorious plugin. Make sure the plugin script is
   loaded __after__ the main Annotorious script.
3. Attach the plugin to Annotorious using the ``anno.addPlugin`` API method.
4. Specify the base URL of the ElasticSearch server using a ``base_url`` config param.

## Example

    ....
      <head>
        <!-- Import main Annotorious script and CSS -->
        <link rel="stylesheet" href="http://annotorious.github.com/latest/annotorious.css" type="text/css" />
        <script src="http://annotorious.github.com/latest/annotorious.min.js"></script>
        
        <!-- Import jQuery - the ElasticSearch plugin depends on it! -->
        <script src="jquery-1.9.0.min.js"></script>
        
        <!-- Import the plugin script -->
        <script src="my-scripts/anno-elasticsearch-plugin.js"></script>
        
        <!-- Use Annotorious' JavaScript API to attach and activate the plugin -->
        <script>
          anno.addPlugin('ElasticSearch', { base_url: 'http://www.my-es-server.com/annotations/' });
        </script>
      <head>
    ....
    
