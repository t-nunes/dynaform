describe('Dynaform', function () {

    beforeEach(function () {
        $('<div class="js-integrationForm"></div>').appendTo('.test');
    });

    afterEach(function () {
        $('<div class="js-integrationForm"></div>').remove();
    });

    it('todos os campos precisam aparecer', function (done) {
        var options = {
            'token': '62bb61431348e22850828a5829c4373faafe29c1',
            'secret': '51a266c2844ccd5cac83d88de88d82d05358aa51',
            'modal': false,
            'fields': {
                'estado': ['PR', 'SC', 'SP', 'RS'],
                'nivel': [
                    'Iniciante',
                    'Intermediário',
                    'Avançado',
                    'Ninja'
                ]
            }
        };
        var $form = $('.js-integrationForm').dynaform(options);

        expect($('.js-integrationForm').find('.form-control').length).toBe(6)

        done();
    });

    it('Deve existir html da modal quando for true', function (done) {
        var options = {
            'token': '62bb61431348e22850828a5829c4373faafe29c1',
            'secret': '51a266c2844ccd5cac83d88de88d82d05358aa51',
            'modal': true,
            'fields': {
                'estado': ['PR', 'SC', 'SP', 'RS'],
                'nivel': [
                    'Iniciante',
                    'Intermediário',
                    'Avançado',
                    'Ninja'
                ]
            }
        };

        var $form = $('.js-integrationForm').dynaform(options);

        expect($('body').find('.js-modal[data-token="'+ options.token +'"]').length).toBe(1)

        done();
    });

})