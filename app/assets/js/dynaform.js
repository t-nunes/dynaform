function arrangeJson(data){
    var initMatch = /^([a-z0-9]+?)\[/i;
    var first = /^\[[a-z0-9]+?\]/i;
    var isNumber = /^[0-9]$/;
    var bracers = /[\[\]]/g;
    var splitter = /\]\[|\[|\]/g;

    for(var key in data) {
        if(initMatch.test(key)){
            data[key.replace(initMatch,'[$1][')] = data[key];
        }
        else{
            data[key.replace(/^(.+)$/,'[$1]')] = data[key];
        }
        delete data[key];
    }


    for (var key in data) {
        processExpression(data, key, data[key]);
        delete data[key];
    }

    function processExpression(dataNode, key, value){
        var e = key.split(splitter);
        if(e){
            var e2 =[];
            for (var i = 0; i < e.length; i++) {
                    if(e[i]!==''){e2.push(e[i]);}
            }
            e = e2;
            if(e.length > 1){
                var x = e[0];
                var target = dataNode[x];
                if(!target){
                    if(isNumber.test(e[1])){
                        dataNode[x] = [];
                    }
                    else{
                        dataNode[x] ={}
                    }
                }
                processExpression(dataNode[x], key.replace(first,''), value);
            }
            else if(e.length == 1){
                dataNode[e[0]] = value;
            }
            else{
                alert('This should not happen...');
            }
        }
    }
}

var Dynaform = function(context, config){

    this.config = $.extend(true, {
        'delayMessage'  : 4000,                             // remove message after x miliseconds
        'endPoint'      : '/endpoint',                      // the target to send the post
        'sendText'      : 'Enviar',                         // button send text
        'sendClass'     : 'btn btn-success btn-block',      // class of button
        'modal'         : false,                            // modal (y,n)
        'modalTitle'    : 'Modal Title',                    // title of modal

        // the default fields in the app
        'fields': {
            'nome': '',
            'email': ''
        }
    }, config)

    if ( !this.config.token || !this.config.secret ) throw new Error('Por favor insira o token/secret válido');

    this.$form = $(context);
    this._fields = this.config.fields;

    this.init();
}

Dynaform.prototype.getModal = function(){
    return $('.js-modal[data-token="'+ this.config.token +'"]')
}

// reset the form
Dynaform.prototype.resetForm = function(){
    var $form =
        this.config.modal
            ? this.getModal().find('.js-formInner')
            : this.$form.find('.js-formInner');
    $form.find('.alert').remove();
    $form[0].reset();
}

Dynaform.prototype.message = function (message, state) {
    state = state || "alert-success";
    return $('<div class="alert ' + state + ' js-alert">' + message + '</div>')
};

Dynaform.prototype._buildHidden = function($element,token,secret){
    $element
        .prepend( this._buildInput('token',  token ,'hidden') )
        .prepend( this._buildInput('secret', secret ,'hidden') )
}

// Build a input
Dynaform.prototype._buildInput = function(name, value, type){
    type = type || "text";
    value = value || "";
    return $('<input type="'+ type +'" name="'+ name +'" class="form-control" value="'+ value +'">')
};

// Build a Option DOM element inside a select
Dynaform.prototype._buildOption = function(value){
    return $('<option value="'+ value +'">'+ value +'</option>')
};

// Build a Select DOM element
Dynaform.prototype._buildSelect = function(name,options){
    if ( !Array.isArray(options) ) throw new Error('options is not a Array, options is a ' + typeof(options) )

    var countOptions    = options.length,
        $select         = $('<select id="'+ name +'" name="'+ name +'" class="form-control">');

    // insert the options in
    for ( var i = 0; i < countOptions; ++i ){
        $select.append(this._buildOption(options[i]));
    }

    return $select;

}

// if value array is a select else is a input
Dynaform.prototype._buildControl = function(name,value){
    return Array.isArray(value) ? this._buildSelect(name,value) : this._buildInput(name)
}

// build the form group englobe the controls
Dynaform.prototype._buildFormGroup = function(name,value,label){
    label = label || name;
    return $('<div class="form-group"><label class="h-text-capitalize">'+ label +'</label></div>')
            .append(this._buildControl(name,value));
};

// build button element
Dynaform.prototype._buildButton = function(text){
    text = text || this.config.sendText;
    return $('<button type="submit" class="'+ this.config.sendClass +'">'+ text +'</button>');
}

// build Modal element
Dynaform.prototype._buildModal = function(token, $form, modalTitle){
    if ( $('.js-modal[data-token="'+ token +'"]').length > 0 ) throw new Error('Já existe uma modal com essa token');

    modalTitle = modalTitle || this.config.modalTitle;

    var $modal = $('<div data-token="'+ token +'" class="modal fade in js-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h2 class="modal-title">'+ modalTitle +'</h2><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body js-modalBody"></div></div></div></div>')
        .appendTo('body');

    $modal.find('.js-modalBody').append($form)

    this.$form.on('click',function(e){
        e.preventDefault();
        this.getModal().modal('toggle')
    }.bind(this));
}

Dynaform.prototype._buildForm = function(){
    var $form = $('<form class="js-formInner">')

    this._buildHidden($form, this.config.token, this.config.secret );

    var count = 1;
    $.each(this._fields, function (e) {
        var name    = e,
            value   = this._fields[e];

        $form.append(this._buildFormGroup( "lead["+ name +"]", value, name ))

        ++count;

    }.bind(this))

    // append the button in form element
    $form.append( this._buildButton() );

    // add event of submit in this form
    this.formSubmit($form);

    return $form;
}

// add event of submit in the form
Dynaform.prototype.formSubmit = function($form){
    var _this = this;

    $form.on('submit', function(e){
        e.preventDefault();

        var formData = $(this).serializeObject();

        arrangeJson(formData);

        $.ajax({
            url: _this.config.endPoint,
            method: "POST",
            dataType: 'json',
            data: JSON.stringify(formData),
            success: function(e){
                $form.append(_this.message('Informações enviadas com sucesso'));
            },
            error: function(e){
                $form.append(_this.message('Erro ao enviar informações', 'alert-danger'))
            },

            complete: function(){
                setTimeout(function(){
                    _this.resetForm();
                },_this.config.delayMessage);
            },

            // finished the resquest reset the form
            beforeSend: function(){
                _this.resetForm();
            }
        })

    });
}

Dynaform.prototype.init = function(){
    var $form = this._buildForm();

    this.config.modal
        ? this._buildModal(this.config.token,$form)
        : this.$form.append($form)
}


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$.fn.dynaform = function(config){
    return new Dynaform(this, config);
};