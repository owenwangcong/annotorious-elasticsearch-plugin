/**
 * A simple storage connector plugin to the ElasticSearch REST interface.
 *
 * Note: the plugin requires jQuery to be linked into the host page.
 *
 * THIS PLUGIN IS FOR DEMO PURPOSES ONLY - DON'T USE IN A PRODUCTION
 * ENVIRONMENT.
 */
annotorious.plugin.ElasticSearch = function(opt_config_options) {
  /** @private **/
  this._STORE_URI = opt_config_options['base_url'];
  this._INDEX_NAME = opt_config_options['index_name'];

  /** @private **/
  this._annotations = [];
  
  /** @private **/
  this._loadIndicators = [];
}

annotorious.plugin.ElasticSearch.prototype.initPlugin = function(anno) {  
  var self = this;
  anno.addHandler('onAnnotationCreated', function(annotation) {
    self._create(annotation);
  });

  anno.addHandler('onAnnotationUpdated', function(annotation) {
    self._update(annotation);
  });

  anno.addHandler('onAnnotationRemoved', function(annotation) {
    self._delete(annotation);
  });
  
  self._loadAnnotations(anno);
}

annotorious.plugin.ElasticSearch.prototype.onInitAnnotator = function(annotator) {
  var spinner = this._newLoadIndicator();
  annotator.element.appendChild(spinner);
  this._loadIndicators.push(spinner);
}

annotorious.plugin.ElasticSearch.prototype._newLoadIndicator = function() { 
  var outerDIV = document.createElement('div');
  outerDIV.className = 'annotorious-es-plugin-load-outer';
  
  var innerDIV = document.createElement('div');
  innerDIV.className = 'annotorious-es-plugin-load-inner';
  
  outerDIV.appendChild(innerDIV);
  return outerDIV;
}

/**
 * @private
 */
annotorious.plugin.ElasticSearch.prototype._showError = function(error) {
  // TODO proper error handling
  window.alert('There is an error when loading annotations.');
  console.log(error);
}

/**
 * @private
 */
annotorious.plugin.ElasticSearch.prototype._loadAnnotations = function(anno) {
  // TODO need to restrict search to the URL of the annotated
  var self = this;
  jQuery.getJSON(this._STORE_URI + '/' + this._INDEX_NAME + '/_search?q=*:*&size=1000', function(data) {
    try {
      jQuery.each(data.hits.hits, function(idx, hit) {
        var annotation = hit['_source'];
        annotation.id = hit['_id'];
        if (jQuery.inArray(annotation.id, self._annotations) < 0) {
          self._annotations.push(annotation.id);
          if (!annotation.shape && annotation.shapes[0].geometry)
            anno.addAnnotation(annotation);
        }
      });
    } catch (e) {
      self._showError(e);
    }
    
    // Remove all load indicators
    jQuery.each(self._loadIndicators, function(idx, spinner) {
      jQuery(spinner).remove();
    });
  });
}

/**
 * @private
 */
annotorious.plugin.ElasticSearch.prototype._create = function(annotation) {
  var self = this;

  $.ajax({
   url: this._STORE_URI + '/' + this._INDEX_NAME + '/_doc/' + Date.now() + "_" + Math.floor(Math.random()*1000),
   type: 'PUT',
   data: JSON.stringify(annotation),
   dataType : "json",
   contentType: "application/json; charset=utf-8",
   success: function(response) {
    var id = response['_id'];
    annotation.id = id;
	console.log('Created!');
	console.log('annotation.id:'+annotation.id);
   }
  });
  
}

/**
 * @private
 */
annotorious.plugin.ElasticSearch.prototype._update = function(annotation) {
  var self = this;
  jQuery.ajax({
    url: this._STORE_URI + '/' + this._INDEX_NAME + '/_doc/' + annotation.id,
    type: 'POST',
    data: JSON.stringify(annotation),
    dataType : "json",
    contentType: "application/json; charset=utf-8",
	success: function(response) {
		console.log('Updated!');
    }
 }); 
}

/**
 * @private
 */
annotorious.plugin.ElasticSearch.prototype._delete = function(annotation) {
  jQuery.ajax({
    url: this._STORE_URI + '/' + this._INDEX_NAME + '/_doc/' + annotation.id,
    type: 'DELETE'
  });
}
