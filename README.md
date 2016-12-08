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
    1. Etapas: (Usuário pede para resetar senha em /forgotPassword) -> (Servidor Envia email) -> (Usuário redefine a senha passando como parâmetro o token recebido no email) -> (Servidor atualiza a senha e invalida token). Segui o tutorial do [Sahat Yalkabov](http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/).
    2. Permitir mandar email. Utilizei o [sails-hook-email](https://github.com/balderdashy/sails-hook-email) (tive muito problema de timeout. Acho melhor usar a API do mailGun) - [commit](https://github.com/makah/sails-rateSite/commit/1122dfcaa40f6c376a31d0b5d9170204f407a59e)
        1. Para as configurações do Email (principalmente a senha) não ficarem no repositório, eu as coloquei no [config.local](http://sailsjs.org/documentation/concepts/configuration/the-local-js-file) que não é versionado por default.
        2. Eu estava com problema para enviar email pelo Gmail. Para resolver eu ativei o 2-steps verification e adicionei um 'App Password'. Também tentei usar o [Mailgun](https://www.mailgun.com/)
    3. Permitir resetar a senha e verifica se o token expirou Criar token com expiration - [commit](https://github.com/makah/sails-rateSite/commit/544edb6723d20cc22c73569faf6cf8fa505928bd)
6. Criar login pelo Google [commit](https://github.com/makah/sails-rateSite/commit/49545f87d0a0bba14649ad7661c221e53e4454b4)
    1. Seguir os passos para criar seu app no [Google API](https://console.developers.google.com) - [Tutorial do Jenkins](https://wiki.jenkins-ci.org/display/JENKINS/Google+Login+Plugin)
    2. Implementar o Google Auth via [passport-google-oauth](http://passportjs.org/docs/google) seguindo o tutorial do [sails-social-auth-example](https://github.com/stefanbuck/sails-social-auth-example/blob/master/config/express.js) e o tutorial do [Michael Herman](http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/#.VxUt8_krKCh)
    3. Note que não precisamos fazer o google/callback porque o controller pega todos os google/* [FIX](https://github.com/stefanbuck/sails-social-auth-example/issues/10)
    4. Me ajudou ler essa [pergunta do Stackoverflow](http://stackoverflow.com/questions/11485271/google-oauth-2-authorization-error-redirect-uri-mismatch)
7. Alterei o User porque o beforeUpdate estava fazendo o hash do hash da senha - [commit](https://github.com/makah/sails-rateSite/commit/f53d644bba1d22bdc3203545de4217a6123b567d)
    1. Me ajudou um issue do [Sails-REST-API](https://github.com/ghaiklor/generator-sails-rest-api/issues/70)


### Fase 3 - Início da parte de negócio ###
Começaremos a parte de negócio que cria o conceito de Empregado (Employer) e Prestador de Serviço (Employee). O prestador de serviço deve definir a sua área de atuação. Também será criado o conceito de comentários, que possui um Empregado, um Prestador de Serviço, uma classificação e o texto do comentário. 

1. Criar o Employer e Employee - [commit](https://github.com/makah/sails-rateSite/commit/2313df1bca75ebbf3d969ddefc316f5374fb4cfe)
    1. Todos os usuários possuem um Employer por padrão (criado no `beforeCreate()` do User). O Employee é criado na tela principal quando o usuário está logado (Dashboard).
    2. Na realidade o User possuirá dois perfis um como Employer e outro como Employee e terá um [relacionamento de um para um](http://sailsjs.org/documentation/concepts/models-and-orm/associations/one-to-one)
    3.  O Employee possui uma área de atuação `workingRegion` específica. Atualmente o `workingRegion` está em formato de string. No futuro podemos criar um Model Região e permitir uma [relacionamento um para vários](http://sailsjs.org/documentation/concepts/models-and-orm/associations/one-to-many). 
    4. Criamos a política `policies/insertUserId.js` que adiciona o usuário logado (userID) dentro da requisição enviada (body.param do POST). Peguei ideia do [Tarmo Leppänen](https://github.com/tarlepp/angular-sailsjs-boilerplate-backend/blob/master/api/policies/addDataCreate.js) via Gitter e pelo Código.
2. Criar a busca pelos Employees - [commit](https://github.com/makah/sails-rateSite/commit/8204bcf89baabd4e76da30a03008c4ba7b9af861)
    1. Preferi criar um serviço de busca que é responsável por ter o algoritmo de busca. Inicialmente criei apenas a busca pelo prestador de serviço
    2. O EmployeeController é responsável apenas por organizar o _request_ para o serviço e criar o _response_ para o usuário
    3. Criei uma view simples com postback mesmo. A pesquisa ficou na área privada (dashboard) e o resultado em uma página a parte.
3. Criar a estrutura de Review - [commit](https://github.com/makah/sails-rateSite/commit/a4c60affcc65f4a2480be2e4b8568b78da769625)
    1. Um review possui um comentário e um rating, e tem um relacionamento de um para um com um cliente e um prestado de serviço.
    2. Escolhi colocar o rating como um número de 1 a 4. Note que o review terá um rating com quantidades de escolhas pares. Gostei dessa abordagem por obrigar ao usuário a escolher um lado, removendo opiniões neutras ou sem opiniões - [exemplo](http://fluidsurveys.com/university/odds-evens-ongoing-debate-rating-scale/)
    3. Nesse commit, apenas de eu criar o RatingService, eu não estou fazendo o cálculo médio do rating. Farei no próximo commit.
4. Adicionar o [MongoDB](https://www.mongodb.com/) - [commit](https://github.com/makah/sails-rateSite/commit/d1155b703e292b1280e9d70c0766a4083e4e411e)
    1. Segui o tutorial do [Ponzi Coder](http://irlnathan.github.io/sailscasts/blog/2013/08/30/building-a-sails-application-ep10-changing-databases-to-mongodb-with-sails-adapters/) que utiliza [sails-mongo](https://github.com/balderdashy/sails-mongo)
    2. Depois criei os usuários root e rateServerName e depois rodei o mongod com `--auth` - [tutoral](http://www.codexpedia.com/devops/mongodb-authentication-setting/)
    3. Por segurança, eu coloquei o usuário e senha no config/local.js:
    ```
    connections: {
      mongodb: {
          user: 'MY_NAME',
          password: 'MY_PASSWORD_WITHOUT_@_CHAR',
      }
    }
    ```
    4. Bom [tutorial](http://mongly.openmymind.net/tutorial/index) do MongoDB
5. Fazer o cálculo do rating cache dos prestadores de serviço corretamente - [commit](https://github.com/makah/sails-rateSite/commit/dfc0909f32c9204e3278007cc24316bf5757089a)
    1. Criei o serviço `services/RatingService.js` para tratar dos cálculos de rating dos Prestadores de serviço
    2. Atualmente estou fazendo uma média simples para determinar o rating do prestador de serviço
    3. Eu escolhi deixar um cache porque imaginei que o cálculo de rating pode ser muito custoso para ser executado a todo momento - eu precisaria de todos os reviews de cada usuário
    4. Achei melhor criar uma serviço, a deixar no controller, porque:
        1. Quero que um job execute a tarefa de recalcular o rating de todos os usuários
        2. Podemos ter ratings de outros models
        3. Podemos ter um algoritmos mais complexos que leve em conta a expertise do usuário ou a relevância do voto e etc. - exemplo de [cálculo do IMDB](http://www.imdb.com/help/show_leaf?votestopfaq)
6. Criar o cachedRating como uma tarefa externa - [commit](https://github.com/makah/sails-rateSite/commit/665541a3a1d6546671cb02445e2f65d753025a90)
    1. Ter o cache do rating do Prestador de serviço otimiza bastante o tempo de resposta do servidor para responder requisições de pesquisa. Por outro lado, me obriga a criar uma terefa para recalcular o cache em algum momento.
    2. Para resolver esse problema eu optei por utilizar o [sails-hook-jobs](https://www.npmjs.com/package/sails-hook-jobs), que utiliza o projeto [Agenda do rschmukler](https://github.com/rschmukler/agenda) e possui persistência do MongoDB. Outra opção seria o [sails-hook-schedule](https://www.npmjs.com/package/sails-hook-schedule) ou [node-schedule](http://www.worldnucleus.com/2014/12/run-cron-job-in-sailsjs.html) ou [node-cron](https://github.com/ncb000gt/node-cron). Discussão interesante sobre [Scheduler no Sails](https://github.com/balderdashy/sails/issues/2092)
        1. Para a instalação do hook eu segui os passos do [manual](https://www.npmjs.com/package/sails-hook-jobs)
        2. Eu escolhi deixar como padrão o scheduler como disable, em config/hooks.js. Se quiser ligar bastar colocar na configuração ou no locals.js `hooks: {"jobs": true}`. Também pode desabilitar uma tarefa específica via `disable: true` dentro da configuração do próprio job.
        3. Para configurar o mongoDB (que já está estou usando no projeto e com --auth) segui os passos:
        ```
        show databases
        use jobs
        db.createUser(
          {
        	user: "JobScheduler_SailsServer",
        	pwd: "MY_PASSWORD",
        	roles: [ { role: "root", db: "admin" } ]
          }
        );
        ```
    3. Como o sails provê uma forma de levantar um servidor que não execute nenhum request (via [sails.load()](http://sailsjs.org/documentation/reference/application/sails-load) [exemplo](http://stackoverflow.com/questions/24123090/using-waterline-model-outside-sailsjs-api), eu consigo levantar um servidor sails que execute unicamente as tarefas/jobs.
7. [minor] Criar a política policies/insertData que utilizo para debug de request - [commit](https://github.com/makah/sails-rateSite/commit/830eebb4f39b77cf5b0c995352868c288fd4317a)
8. Adiciona reCAPTCHA - [commit](https://github.com/makah/sails-rateSite/commit/13df98706a14d89d0d5b5340d90f36cf1b5f9ae9)
    1. Utilizei a biblioteca [reCAPTCHA2](https://www.npmjs.com/package/recaptcha2), segundo o tutoral com tranquilidade
    2. Como todas as outras senhas, eu as coloquei no config/locals.js

### Fase 4 - Testes ###
O Sails [aconselha](http://sailsjs.org/documentation/concepts/testing) utilizar para os testes o [Mocha](https://mochajs.org/) com [Chai](http://chaijs.com/).
Li um [artigo](http://www.zsoltnagy.eu/Writing-Automated-Tests-with-Mocha-and-Chai/) bem básico que explica muito bem o Mocha + Chai. De qualquer forma achei muito confuso, porque existem 1000 soluções na web e achei difícil encontrar um exemplo completo com explicação - com teste de serviço, mock de serviço e etc.

1. Segui os passos do [Sails/Testing](http://sailsjs.org/documentation/concepts/testing) e com o exemplo do [Tarmo Leppänen](https://github.com/tarlepp/angular-sailsjs-boilerplate-backend/tree/d7968a714af79d1f82a8bbe1554e334a9f8d3f67/test) e [albertosouza](https://github.com/albertosouza/sails-test-example/tree/master/test) - [commit](https://github.com/makah/sails-rateSite/commit/85b8928e56ab599ef4fb82f56459827d1e23efbe)
    1. Mesmo com muita informação, o passo-a-passo do Sails resolveu bem
    2. Só precisei aprender o que eu precisava instalar; alterar o banco de dados para o `localDiskDb`; desativar os hooks que não são necessários para reduzir o tempo de inicialização do Sails
2. Criar um configuração para o teste e adicionar alguns testes - [commit](https://github.com/makah/sails-rateSite/commit/ae35cf2a68d84a205c16c626ad9c48abd021a43d)
    1. Criar uma `config/env/test.js` para deixar as configurações específicas dos testes
    2. Estou utilizando o sails-memory
    3. Como a configuração do `config/local/js` é prioridade de todas as configurações, coloquei como prioridade no `test/bootstrap.test.js` o log como `silent`
3. Criar um teste com Mock do serviço utilizado no Modelo - [commit](https://github.com/makah/sails-rateSite/commit/a59ea3b8796505a4a1c64ae5bed675893df0386c)
    1. Para testar a criação do User foi necesário utilizar um mock do serviço de autenticação, já que o `User.beforeCreate()` utiliza um CAPTCHA.
    2. Tomei como base no artigo do [Sergio Cruz](https://blog.sergiocruz.me/unit-testing-sails-js-how-to-mock-sailsjs-services-in-controllers/)
    3. Usei o [sinon](http://sinonjs.org/)
    4. Estou usando um drop no after() para limpar o banco de dados, mas nessa pergunta temos outra solução http://stackoverflow.com/questions/26063827/drop-the-entire-sails-memory-database
4. Criar um teste de integração nos Controller - [commit](https://github.com/makah/sails-rateSite/commit/bfeb8f0f61a602d543960930a4f94841c10be3fd)
    1. Para facilitar os testes, estou usando o [supertest](https://github.com/visionmedia/supertest)
5. Atualizar o teste para utilizar o [Chai](http://chaijs.com/) - [commit](https://github.com/makah/sails-rateSite/commit/0f5b020f35955d3033d0505db9fa78bf79a61f0f)
    1. Atualizei um teste apenas para demostrar o uso do Chai.
    2. Preferi utilizar o `expect()`, entendi que evita possíveis erros quando a variável é undefined
6. Criar um exemplo que dependa de uma base de dados (fixtures) - [commit](https://github.com/makah/sails-rateSite/commit/0cc99e61a2894a3427faa53c96b70c4bf4dc2d65)
    1. Estou usando os `fixtures` para carregar um conjunto de usuários a serem criados
    2. [Texto interessante](http://www.zsoltnagy.eu/asynchronous-tests-and-fixtures-with-mocha-and-chaijs/)
    3. Durante os meus testes eu tive problema com "after all hook", i.e. test.bootstrap.after(), que só possui a linha `sails.lower()`. Eu abri um [ticket no Sails](https://github.com/balderdashy/sails/issues/3751). Como eu acredito que o lower está chamando a callback antes de finalizar todos os processos, eu adicionei um `setTimeout(done, 1000);`. Essa linha pode sair quando o problema for resolvido.
7. Continuar os testes para 100% de cobertura - incompleto para sempre

Fase 5
    Usar o Angular, de preferência usar esse projeto como back apenas e um front em angular separado
    Colocar Validações no cliente

#### Detalhes de implementação ####
* Para o front/CSS pensei em usar [Foundation](http://foundation.zurb.com/), mas depois de estudar um pouco decidi deixar a parte de design para depois. Não tenho competência para isso no momento.
* Utilizei async para algumas tarefas ao invés de callback diretamente - [tutorial](http://sahatyalkabov.com/jsrecipes/#!/backend/organizing-callbacks-with-async). Pessoalmente eu prefiro [Promise](https://github.com/kriskowal/q/wiki/API-Reference) que já uso no angular.js, mas as libs são feitas com callback, por isso preferi utilizar o async a usar uma Promise com wrapper


### Dificuldades ###
Eu não consegui usar o `config/local.js`, nem o `config/env/*.js` dentro do `config/passport.js`. Gostaria de usa-lo para salvar o appURL e o GoogleAPI. 

Depois de algum estudo, verifiquei que o Sails não tem um suporte 100% para esse tipo de uso. Então decidi colocar o appURL (variável com a URL) como uma variável do ambiente `APP_URL="http://falcon-medico-makah.c9users.io:8080/" sails lift` - preferia ter colocado em `config/env/*`. [commit](https://github.com/makah/sails-rateSite/commit/cdb3298827f27ea2a5e0c4b630f6cb25861dbfe4) 

Já o GoogleAPI eu coloquei o workarround `require(./local)` - [Stackoverflow](http://stackoverflow.com/questions/36563270/how-do-i-access-environment-variables-in-config-sailsjs)

Podemos usar o Waterline via callback .exec() ou via promise .then(), como eu prefiro usar a Promise, optei pelo .then() - até ai tudo bem. A questão é que o .then() me retorna uma Bluebird Promise, mas isso não quer dizer que eu posso criar uma Promise sem adicionar a biblioteca no meu projeto - eu tenho acesso ao objecto Promise já criado, não à bibilioteca. Pata ter acesso eu adicionei o Bluebird no projeto e adicionei o `requre("Bluebird")`.
