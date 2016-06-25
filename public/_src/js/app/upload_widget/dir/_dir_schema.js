module.exports = function () {
  
  var schema = {
    type                : 'object',
    additionalProperties: false,
    required            : ['upload_widget_id', 'max_files', 'accept', 'support_multiple', 'maximum_size_bytes', 'minimum_size_bytes', 'control'],
    properties          : {
      upload_widget_id  : {
        type     : 'string',
        minLength: 1
      },
      max_files         : {
        type   : 'integer',
        minimum: 1
      },
      min_files         : {
        type   : 'integer',
        minimum: 0
      },
      accept            : {
        type: 'string',
        enum: ['image/*']
      },
      support_multiple  : {
        type: 'boolean'
      },
      maximum_size_bytes: {
        type   : 'number',
        minimum: 1
      },
      minimum_size_bytes: {
        type   : 'number',
        minimum: 1
      },
      control           : {
        type                : 'object',
        additionalProperties: false,
        required            : ['done', 'cancel'],
        properties          : {
          done  : {}, // function - called with image links objects
          cancel: {} // function - to cancel
        }
      }
    }
  };
  
  return schema;
  
};