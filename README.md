# RateSite

Aprendendo a montar um site com SailsJS. 
Escolhi por criar o projeto RateSite. Esse programa terá dois usuários padrão. Um prestatador de serviço e um cliente.
Exemplo de uso: Chaveiro/Cliente; Médico/Paciente; Possuidor de Carro/Cliente; Manicure/Cliente ....


#### Fase 1 ####
1. Criei um projeto no [Cloud9](https://c9.io/)
2. Criei o projeto 'RateSite' no [Sails](http://sailsjs.org/get-started)
3. Primeiro Commit

#### Fase 2 ####
1. Implementar o [Passport](http://passportjs.org/) básico criado por [Giancarlo Soverini](http://iliketomatoes.com/implement-passport-js-authentication-with-sails-js-0-10-2/) e uma explicação geral por [toon.io](http://toon.io/understanding-passportjs-authentication-flow/) - [commit](https://github.com/makah/sails-rateSite/commit/811912dec01ab3d58142e4dceea6f2601c7e91d1)
2. Criar uma tela que apenas logados podem entrar (com logout) - [commit](https://github.com/makah/sails-rateSite/commit/9b9776ffe9d5f435647e09589510385f252e3140)
3. Criar uma mensagem de erro para o usuário, informando que ele não está logado - [commit](https://github.com/makah/sails-rateSite/commit/a0b22f3d9b5415256fa7ee312c23db7a57093548)
    1. Noob: O nome dessa mensagem e flash() - req.flash()
    2. Info: O Chrome volta e meia manda dois POSTs iguais, com isso as vezes mando um flash duplicado. Não consegui impedir de passar na policy a segunda vez.
    3. Info: A maioria dos flash() que criarei no projeto serão no próprio cliente (quando eu usar o AngularJS), não preciso de um modelo muito complexo.
    4. Eu quero fazer um req.flash() e req.redirect('/') na policies/isAuthenticated.js
    5. Eu pensei em usar a proposta de um [serviço 'FlashService' + política 'flash'](http://stackoverflow.com/a/25352340/205034), mas acho que é mais complexo do que eu preciso, i.e. temos que adicionar a policy sempre antes de outras policies que precisam do flash, e principalmente, não podemos fazer um flash e redirect() como era o objectivo.    6. Acabei usando a [ideia](http://stackoverflow.com/a/28621678/205034) do req.flash() simples. Criando um partial EJS para cuidar disso - alterei o EJS da resposta para fazer para um for no req.flash() [mais robusto]
4. Enviar o password encriptado para o servidor.
    1. Vou continua enviando plain text porque usamos HTTPS
    2. [Explicação¹](http://stackoverflow.com/a/4121657)
    3. [Javascript Cryptography](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/august/javascript-cryptography-considered-harmful/)
5. Criar esqueci minha senha
    1. Etapas: (Usuário pede para resetar senha em /forgotPassword) -> (Servidor Envia email) -> (Usuário redefine a senha passando como parâmetro o token recebido no email) -> (Servidor atualiza a senha e invalida token). Segui o tutorial do [Sahat Yalkabov](http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/)
    2. Permitir mandar email. Utilizei o [sails-hook-email](https://github.com/balderdashy/sails-hook-email) (tive muito problema de timeout. Acho melhor usar a API do mailGun) - [commit](https://github.com/makah/sails-rateSite/commit/1122dfcaa40f6c376a31d0b5d9170204f407a59e)
        1. Para as configurações do Email (principalmente a senha) não ficarem no repositório, eu as coloquei no [config.local](http://sailsjs.org/documentation/concepts/configuration/the-local-js-file) que não é versionado por default.
        2. Eu estava com problema para enviar email pelo Gmail. Para resolver eu ativei o 2-steps verification e adicionei um 'App Password'. Também tentei usar o [Mailgun](https://www.mailgun.com/)
    3. Permitir resetar a senha e verifica se o token expirou Criar token com expiration - [commit](https://github.com/makah/sails-rateSite/commit/544edb6723d20cc22c73569faf6cf8fa505928bd)
6. Criar login pelo Google [commit](https://github.com/makah/sails-rateSite/commit/49545f87d0a0bba14649ad7661c221e53e4454b4)
    1. Seguir os passos para criar seu app no [Google API](https://console.developers.google.com) - [Tutorial do Jenkins](https://wiki.jenkins-ci.org/display/JENKINS/Google+Login+Plugin)
    2. Implementar o Google Auth via [passport-google-oauth](http://passportjs.org/docs/google) seguindo o tutorial do [sails-social-auth-example](https://github.com/stefanbuck/sails-social-auth-example/blob/master/config/express.js) e o tutorial do [Michael Herman](http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/#.VxUt8_krKCh)
    3. Note que não precisamos fazer o google/callback porque o controller pega todos os google/* [FIX](https://github.com/stefanbuck/sails-social-auth-example/issues/10)
    4. Me ajudou ler essa [pergunta do Stackoverflow](http://stackoverflow.com/questions/11485271/google-oauth-2-authorization-error-redirect-uri-mismatch)
7. Alterei o User porque o beforeUpdate estava fazendo o hash do hash da senha - commit []
    1. Me ajudou um issue do [Sails-REST-API](https://github.com/ghaiklor/generator-sails-rest-api/issues/70)


### Fase 3 - Início da parte de negócio ###
Começaremos a parte de negócio que cria o conceito de Empregado (Employer) e Prestador de Serviço (Employee). O prestador de serviço deve definir a sua área de atuação. Também será criado o conceito de comentários, que possui um Empregado, um Prestador de Serviço, uma classificação e o texto do comentário. 

1. Criar o Employer e Employee. O Employee possui uma área de atuação `workingRegion` específica. - [commit](https://github.com/makah/sails-rateSite/commit/2313df1bca75ebbf3d969ddefc316f5374fb4cfe)
    1. Todos os usuários possuem um Employer por padrão (criado no `beforeCreate()` do User). O Employee é criado na tela principal quando o usuário está logado (Dashboard).
    2. Na realidade o User possuirá dois perfis um como Employer e outro como Employee e terá um [relacionamento de um para um](http://sailsjs.org/documentation/concepts/models-and-orm/associations/one-to-one)
    3. Atualmente o `workingRegion` está em formato de string. No futuro podemos criar um Model Região e permitir uma [relacionamento um para vários](http://sailsjs.org/documentation/concepts/models-and-orm/associations/one-to-many). 
    4. Criamos a política `policies/insertUserId.js` que adiciona o usuário logado (userID) dentro da requisição enviada (body.param do POST). Peguei ideia do [Tarmo Leppänen](https://github.com/tarlepp/angular-sailsjs-boilerplate-backend/blob/master/api/policies/addDataCreate.js) via Gitter e pelo Código.


Fase 4 
Buitify. Colocar favicon; usar foundation


- Colocar verificações no cliente

#### Detalhes de implementação ####
* Para o front/CSS pensei em usar [Foundation](http://foundation.zurb.com/), mas depois de estudar um pouco verifiquei que vou deixar a parte de design para depois. Não tenho competência para isso no momento.
* Utilizei async para algumas tarefas ao invés de callback diretamente - [tutorial](http://sahatyalkabov.com/jsrecipes/#!/backend/organizing-callbacks-with-async). Pessoalmente eu prefiro [Promise](https://github.com/kriskowal/q/wiki/API-Reference) que já uso no angular.js, mas as libs são feitas com callback, por isso preferi utilizar o async a usar uma Promise com wrapper

### Dificuldades ###
Eu não consegui usar o `config/local.js`, nem o `config/env/*.js` dentro do `config/passport.js`. Gostaria de usa-lo para salvar o appURL e o GoogleAPI. 
Depois de algum estudo, verifiquei que o Sails não tem um suporte 100% para esse tipo de uso. Então decidi colocar o appURL (variável com a URL) como uma variável do ambiente `APP_URL="http://falcon-medico-makah.c9users.io:8080/" sails lift` - preferia ter colocado em `config/env/*`. [commit](https://github.com/makah/sails-rateSite/commit/cdb3298827f27ea2a5e0c4b630f6cb25861dbfe4)
Já o GoogleAPI eu coloquei o workarround `require(./local)` - [Stackoverflow](http://stackoverflow.com/questions/36563270/how-do-i-access-environment-variables-in-config-sailsjs)
