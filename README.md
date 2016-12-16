## Introdução
Este código foi criado para fornecer uma maneira simples de construir um formulário

## Exemplo de código

```html

<html>
 <head>
    ...
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
 </head>
 <body>
    <div id="integration_form"></div>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="assets/js/dynaform.js"></script>

    <script type="text/javascript" charset="utf-8">
     $(document).ready(function() {
       options = {
         token: '62bb61431348e22850828a5829c4373faafe29c1',
         secret: '51a266c2844ccd5cac83d88de88d82d05358aa51',
         fields: {
           estado: ['PR','SC','SP','RS'],
           nível: ['Iniciante','Intermediário','Avançado','Ninja']
         }
       }
       $('#integration_form').dynaform(options);
     });
    </script>
 </body>
</html>

```

## Instalação

com o projeto clonado na sua maquina é só rodar os seguintes comandos
```
npm install
```
em seguida o comando
```
npm run app
```
que inicia o servidor que ficará escutando a porta 3030 do seu localhost `http://localhost:3030`


#### Dependências
esse projeto depende do jquery e bootstrap por favor instale ou utilize os cdns

```html
<!-- Dentro do Head -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

<!-- Final Body -->
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
```



## API Reference

##### Methods
```html
var $dynaform = $('.js-target').dynaform({
    modal: true,
    modalTitle: 'Título Modal'
});

$dynaform.getModal();       // pega a modal do formulário
$dynaform.resetForm();      // limpa o formulário
$dynaform.message(Msg);     // retorna uma mensagem em HTML
```


##### Plugin Options
```javascript
    var defaultOptions = {
                'delayMessage'  : 4000,                     // remove message after x miliseconds
        'endPoint'      : '/endpoint',                      // the target to send the post
        'sendText'      : 'Enviar',                         // button send text
        'sendClass'     : 'btn btn-success btn-block',      // class of button
        'modal'         : false,                            // modal (y,n)
        'modalTitle'    : 'Modal Title',                    // title of modal
    }
```


## Tests
para abrir os testes é só navegar para o arquivo `SpecRunner.html` localizado na raiz do projeto e clicar 2x