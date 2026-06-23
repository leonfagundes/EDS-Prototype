# Documentação técnica — POSTA

## 1. Visão geral

O POSTA é uma aplicação proposta para preparar rascunhos individualizados no Gmail a partir de uma planilha de destinatários e de textos-base reutilizáveis. O sistema deve validar os dados, reter registros problemáticos, permitir revisão humana e criar um rascunho separado para cada destinatário liberado.

O princípio operacional central é: **o sistema cria rascunhos, mas não envia e-mails automaticamente**.

### Objetivos

- Reduzir trabalho manual na preparação de correspondências individualizadas.
- Evitar envio para dados inválidos, duplicados ou ambíguos.
- Padronizar mensagens por meio de textos-base.
- Preservar revisão e decisão humanas antes do envio pelo Gmail.
- Registrar o resultado operacional sem manter cópias desnecessárias do conteúdo individualizado.

### Escopo atual

O repositório contém um protótipo frontend estático em HTML, CSS e JavaScript. Ele demonstra navegação, validações básicas e estados de processamento com dados simulados.

Não estão implementados no protótipo:

- backend e banco de dados;
- autenticação de usuários;
- Google OAuth e Gmail API;
- upload e leitura real de XLSX;
- persistência de lotes, modelos ou correções;
- geração real de rascunhos;
- exportação real de relatórios;
- telemetria, logs de servidor e controle de acesso.

## 2. Perfis de usuário

### Operador/assistente

Prepara lotes, importa dados, resolve inconsistências, revisa a prova e solicita a criação dos rascunhos.

### Administrador

Gerencia usuários, permissões, contas remetentes, políticas de retenção, integrações e parâmetros operacionais.

### Revisor/gestor

Consulta histórico, acompanha resultados e revisa os rascunhos no Gmail antes do envio.

Um mesmo usuário pode acumular perfis, conforme a política da organização.

## 3. Fluxo principal

1. O operador identifica o lote.
2. Seleciona uma conta Gmail autorizada e um texto-base.
3. Define um assunto fixo.
4. Importa uma planilha e seleciona a aba.
5. Mapeia as colunas obrigatórias e opcionais.
6. O sistema valida e classifica os registros.
7. O operador corrige ou decide sobre registros retidos.
8. O sistema apresenta uma prova da mensagem.
9. O operador confirma o processamento.
10. O sistema cria um rascunho individual por destinatário liberado.
11. Falhas ficam disponíveis para reprocessamento.
12. O resultado consolidado é registrado no histórico.

## 4. Requisitos funcionais

### 4.1 Acesso e autorização

| ID | Requisito |
|---|---|
| RF-001 | O sistema deve autenticar usuários antes de permitir acesso a dados e integrações. |
| RF-002 | O sistema deve autorizar ações conforme o perfil do usuário. |
| RF-003 | O sistema deve encerrar ou renovar sessões conforme a política de segurança. |
| RF-004 | O sistema deve registrar login, logout e tentativas de acesso relevantes para auditoria. |

### 4.2 Mesa de despacho

| ID | Requisito |
|---|---|
| RF-005 | O sistema deve exibir contagens de registros recebidos, liberados, retidos e rascunhos criados. |
| RF-006 | O sistema deve listar os lotes recentes com identificador, título, remetente, situação e resultado. |
| RF-007 | O sistema deve apresentar o andamento de lotes em processamento. |
| RF-008 | O sistema deve destacar falhas disponíveis para reprocessamento. |
| RF-009 | O usuário deve poder atualizar os indicadores da mesa. |

### 4.3 Configuração do lote

| ID | Requisito |
|---|---|
| RF-010 | O usuário deve poder criar, nomear, editar e cancelar um lote antes do processamento. |
| RF-011 | O sistema deve exigir título, remetente, texto-base e assunto. |
| RF-012 | O usuário deve poder selecionar somente remetentes autorizados e ativos. |
| RF-013 | O usuário deve poder selecionar um texto-base existente. |
| RF-014 | O usuário deve poder habilitar ou desabilitar personalização por colunas. |
| RF-015 | O usuário deve poder habilitar ou desabilitar tratamento por gênero. |
| RF-016 | O sistema deve impedir variáveis no assunto enquanto essa capacidade não for suportada. |
| RF-017 | O sistema deve salvar o progresso de um lote em preparação. |

### 4.4 Importação e mapeamento da planilha

| ID | Requisito |
|---|---|
| RF-018 | O usuário deve poder enviar arquivos XLSX dentro dos limites configurados. |
| RF-019 | O sistema deve listar as abas existentes e permitir selecionar uma delas. |
| RF-020 | O sistema deve identificar cabeçalhos e sugerir o mapeamento das colunas. |
| RF-021 | O usuário deve poder mapear nome, e-mail, gênero e variáveis adicionais. |
| RF-022 | O sistema deve exigir as colunas mínimas necessárias ao processamento. |
| RF-023 | O sistema deve informar quantidade de linhas, abas, tamanho e problemas estruturais do arquivo. |
| RF-024 | O sistema deve rejeitar arquivo corrompido, formato não permitido ou arquivo acima do limite. |
| RF-025 | O usuário deve poder substituir a planilha antes do despacho. |

### 4.5 Validação e triagem

| ID | Requisito |
|---|---|
| RF-026 | O sistema deve validar presença e formato do nome e do e-mail. |
| RF-027 | O sistema deve detectar e-mails duplicados no lote. |
| RF-028 | O sistema deve classificar registros como liberados ou retidos. |
| RF-029 | O sistema deve classificar retenções por motivo, incluindo dado inválido, duplicidade e gênero incerto. |
| RF-030 | O usuário deve poder filtrar a lista de ocorrências por categoria. |
| RF-031 | O usuário deve poder corrigir dados retidos antes do processamento. |
| RF-032 | O usuário deve poder decidir qual ocorrência manter em casos de duplicidade. |
| RF-033 | O usuário deve poder informar manualmente o tratamento adequado quando houver ambiguidade. |
| RF-034 | Correções confirmadas devem ser preservadas no lote. |
| RF-035 | O sistema deve recalcular os totais após cada correção ou exclusão. |
| RF-036 | O sistema deve exigir confirmação explícita quando uma proporção configurável de registros ficar retida. |
| RF-037 | O sistema deve impedir o processamento de registros ainda retidos. |

### 4.6 Textos-base e personalização

| ID | Requisito |
|---|---|
| RF-038 | O usuário autorizado deve poder criar, editar, duplicar, arquivar e consultar textos-base. |
| RF-039 | Cada texto-base deve possuir nome, assunto padrão opcional, corpo, variáveis aceitas e estado. |
| RF-040 | O editor deve permitir inserir variáveis a partir das colunas mapeadas. |
| RF-041 | O sistema deve validar se todas as variáveis utilizadas possuem valores ou regra de fallback. |
| RF-042 | O sistema deve suportar regras de tratamento por gênero sem inferência automática insegura. |
| RF-043 | O sistema deve manter versionamento ou histórico de alteração dos textos-base usados em lotes. |

### 4.7 Prova e confirmação

| ID | Requisito |
|---|---|
| RF-044 | O sistema deve apresentar remetente, destinatário de referência, assunto e corpo resultante antes do despacho. |
| RF-045 | O usuário deve poder navegar por amostras representativas dos registros liberados. |
| RF-046 | O sistema deve destacar variáveis aplicadas, ausentes ou substituídas por fallback. |
| RF-047 | O usuário deve poder voltar às etapas anteriores sem perder correções salvas. |
| RF-048 | O sistema deve exigir confirmação final com os totais de liberados e retidos. |

### 4.8 Integração com Gmail

| ID | Requisito |
|---|---|
| RF-049 | O administrador deve poder conectar uma conta Gmail por Google OAuth. |
| RF-050 | O sistema não deve solicitar nem armazenar a senha da conta Google. |
| RF-051 | O sistema deve exibir estado, proprietário, finalidade e validade da autorização. |
| RF-052 | O administrador deve poder revogar ou renovar uma autorização. |
| RF-053 | O sistema deve criar um rascunho separado para cada destinatário liberado. |
| RF-054 | O sistema deve criar rascunhos na conta remetente selecionada. |
| RF-055 | O sistema não deve enviar mensagens automaticamente. |
| RF-056 | O sistema deve registrar o identificador retornado pela Gmail API para controle operacional. |
| RF-057 | O sistema deve limitar concorrência e respeitar cotas da Google API. |
| RF-058 | O sistema deve aplicar retentativas com espera progressiva somente a falhas transitórias. |
| RF-059 | O usuário deve poder reprocessar apenas os registros com falha. |
| RF-060 | O reprocessamento deve ser idempotente e não pode criar rascunhos duplicados. |
| RF-061 | O usuário deve poder cancelar um processamento ainda não concluído quando tecnicamente possível. |

### 4.9 Histórico, relatórios e auditoria

| ID | Requisito |
|---|---|
| RF-062 | O sistema deve manter histórico de lotes com período, operador, remetente, modelo, totais e situação. |
| RF-063 | O sistema deve registrar ocorrências e decisões tomadas na triagem. |
| RF-064 | O usuário autorizado deve poder consultar detalhes de um lote. |
| RF-065 | O usuário autorizado deve poder exportar relatório de ocorrências em formato definido pela organização. |
| RF-066 | O histórico deve diferenciar rascunhos criados, falhas e registros retidos. |
| RF-067 | A auditoria deve registrar ações críticas com data, usuário e objeto afetado. |
| RF-068 | O sistema deve aplicar a política de retenção e descarte aos arquivos e dados individualizados. |

## 5. Regras de negócio

| ID | Regra |
|---|---|
| RN-001 | Um registro somente pode seguir para despacho se possuir e-mail válido e todas as variáveis obrigatórias. |
| RN-002 | Registros duplicados permanecem retidos até decisão explícita ou regra previamente configurada. |
| RN-003 | Gênero ou tratamento não deve ser inferido quando a confiança for insuficiente. |
| RN-004 | O assunto é fixo por lote na versão especificada. |
| RN-005 | Cada destinatário liberado corresponde a no máximo um rascunho no mesmo lote. |
| RN-006 | A confirmação de lote com retenção severa deve informar claramente quantos registros ficarão de fora. |
| RN-007 | O envio final ocorre exclusivamente no Gmail e depende de ação humana. |
| RN-008 | Um lote deve manter referência à versão do texto-base usada em seu processamento. |
| RN-009 | Falhas permanentes não devem entrar em ciclo automático de retentativas. |
| RN-010 | Dados individualizados devem ser mantidos somente pelo período necessário à operação e auditoria definida. |

## 6. Requisitos não funcionais

### 6.1 Segurança e privacidade

| ID | Requisito |
|---|---|
| RNF-001 | Todo tráfego deve usar TLS 1.2 ou superior. |
| RNF-002 | Tokens OAuth e segredos devem ser criptografados em repouso e gerenciados fora do código-fonte. |
| RNF-003 | O sistema deve solicitar o menor conjunto de escopos Google necessário. |
| RNF-004 | O acesso deve seguir o princípio do menor privilégio e segregação de funções. |
| RNF-005 | Logs não devem conter tokens, conteúdo integral de mensagens ou dados pessoais desnecessários. |
| RNF-006 | Uploads devem ser validados por extensão, MIME, assinatura, tamanho e conteúdo seguro. |
| RNF-007 | A aplicação deve mitigar XSS, CSRF, injeção, enumeração e abuso de sessão. |
| RNF-008 | Dados pessoais devem obedecer à LGPD, incluindo finalidade, minimização, retenção e descarte. |
| RNF-009 | Operações administrativas e de despacho devem possuir trilha de auditoria inviolável. |

### 6.2 Desempenho e capacidade

| ID | Requisito |
|---|---|
| RNF-010 | Páginas interativas devem responder em até 2 segundos no percentil 95, exceto operações assíncronas. |
| RNF-011 | A validação de uma planilha de até 10.000 linhas deve concluir em até 30 segundos em condições nominais. |
| RNF-012 | Processamentos longos devem ocorrer em segundo plano, com progresso consultável. |
| RNF-013 | O sistema deve suportar paginação ou virtualização para listas extensas. |
| RNF-014 | Limites de tamanho, linhas por lote e concorrência devem ser configuráveis. |

### 6.3 Disponibilidade e confiabilidade

| ID | Requisito |
|---|---|
| RNF-015 | A meta inicial de disponibilidade mensal deve ser de 99,5%, excluídas manutenções programadas. |
| RNF-016 | O processamento deve ser idempotente e recuperável após interrupções. |
| RNF-017 | O sistema deve persistir checkpoints suficientes para retomar ou reprocessar falhas com segurança. |
| RNF-018 | Dependências externas devem possuir timeout, circuit breaker e tratamento explícito de indisponibilidade. |
| RNF-019 | Backup, restauração e testes periódicos de recuperação devem atender aos objetivos definidos de RPO e RTO. |

### 6.4 Usabilidade e acessibilidade

| ID | Requisito |
|---|---|
| RNF-020 | A interface deve ser responsiva para desktop, tablet e celular. |
| RNF-021 | A aplicação deve buscar conformidade WCAG 2.2 nível AA. |
| RNF-022 | Todas as funções devem ser operáveis por teclado, com foco visível e ordem lógica. |
| RNF-023 | Estados, erros e progresso devem ser comunicados por texto e tecnologias assistivas, não apenas por cor. |
| RNF-024 | A interface deve respeitar a preferência de redução de movimento. |
| RNF-025 | Mensagens de erro devem indicar problema e ação de recuperação. |

### 6.5 Manutenibilidade e qualidade

| ID | Requisito |
|---|---|
| RNF-026 | Frontend, API e trabalhadores assíncronos devem possuir contratos e responsabilidades definidos. |
| RNF-027 | O código deve passar por lint, análise estática, testes automatizados e revisão antes da implantação. |
| RNF-028 | Regras de validação e personalização devem possuir testes unitários e de integração. |
| RNF-029 | Mudanças de banco e API devem ser versionadas e compatíveis com estratégia de rollback. |
| RNF-030 | Configurações por ambiente não devem exigir alteração de código-fonte. |

### 6.6 Observabilidade e compatibilidade

| ID | Requisito |
|---|---|
| RNF-031 | O sistema deve produzir logs estruturados, métricas e rastreamento correlacionados por lote. |
| RNF-032 | Alertas devem cobrir falhas de integração, filas paradas, aumento de erros e expiração de credenciais. |
| RNF-033 | A aplicação deve suportar as duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari. |
| RNF-034 | Datas devem ser armazenadas em UTC e exibidas no fuso do usuário ou da organização. |

## 7. Arquitetura recomendada para produção

```text
Navegador
   │
   ▼
Frontend web ─────► API autenticada ─────► Banco relacional
                         │                         │
                         ├────► Armazenamento temporário de arquivos
                         │
                         └────► Fila de trabalhos
                                      │
                                      ▼
                              Worker de processamento
                                      │
                                      ▼
                                Gmail API / OAuth
```

### Componentes

- **Frontend:** interface do operador, validação imediata e acompanhamento de progresso.
- **API:** autenticação, autorização, regras de negócio, lotes, modelos, contas e auditoria.
- **Banco relacional:** usuários, lotes, versões de modelos, mapeamentos, ocorrências e resultados.
- **Armazenamento temporário:** XLSX criptografado, com expiração e descarte automático.
- **Fila/worker:** validação pesada e criação controlada dos rascunhos.
- **Google OAuth/Gmail API:** autorização delegada e criação de rascunhos.
- **Observabilidade:** logs, métricas, alertas e correlação por lote.

## 8. Modelo de dados conceitual

- **User:** identidade, perfil, estado e organização.
- **SenderAccount:** conta Google, proprietário, escopos, estado e expiração.
- **Template:** metadados, estado e versão atual.
- **TemplateVersion:** assunto, corpo, variáveis e autor da alteração.
- **Batch:** título, operador, remetente, modelo, estado e totais.
- **ImportFile:** metadados do arquivo, aba selecionada, hash e expiração.
- **ColumnMapping:** associação entre campos internos e colunas.
- **RecipientRecord:** dados normalizados e estado de validação.
- **Issue:** categoria, descrição, decisão e responsável.
- **DraftJob:** estado do processamento, tentativas e checkpoints.
- **DraftResult:** destinatário, resultado, identificador Gmail e erro sanitizado.
- **AuditEvent:** ator, ação, objeto, data e metadados mínimos.

## 9. Estados sugeridos

### Lote

`RASCUNHO → VALIDANDO → AGUARDANDO_DECISAO → PRONTO → PROCESSANDO → CONCLUIDO`

Estados alternativos: `CANCELADO`, `CONCLUIDO_COM_FALHAS` e `FALHOU`.

### Registro

`IMPORTADO → LIBERADO` ou `IMPORTADO → RETIDO → CORRIGIDO → LIBERADO`.

### Rascunho

`PENDENTE → CRIANDO → CRIADO` ou `PENDENTE → CRIANDO → FALHOU → REPROCESSANDO`.

## 10. Critérios de aceite principais

1. Nenhum registro inválido ou não liberado gera rascunho.
2. Uma nova execução do mesmo lote não duplica rascunhos já criados.
3. O usuário visualiza uma prova antes da confirmação final.
4. O sistema nunca envia mensagens pela integração.
5. A revogação de uma conta impede novos processamentos com ela.
6. Toda ação crítica pode ser atribuída a um usuário e horário.
7. Arquivos e dados pessoais expiram conforme a política configurada.
8. Falhas transitórias podem ser reprocessadas sem repetir sucessos.
9. O fluxo principal é utilizável por teclado e em tela móvel.
10. O histórico consolida resultados sem expor conteúdo individualizado além do necessário.

## 11. Rastreabilidade do protótipo

| Área | Implementado no protótipo | Produção necessária |
|---|---|---|
| Navegação entre áreas | Sim | Integrar permissões e rotas reais |
| Assistente em cinco etapas | Sim | Persistir estado e validar no servidor |
| Campos obrigatórios e assunto sem variável | Sim, no navegador | Repetir validação na API |
| Importação XLSX | Somente representação visual | Parser seguro e armazenamento temporário |
| Mapeamento de colunas | Somente representação visual | Detecção, validação e persistência |
| Triagem e filtros | Sim, com dados fixos | Motor de validação real |
| Correção de ocorrências | Sim, apenas em memória | Formulários, regras e auditoria |
| Confirmação de retenção severa | Sim | Limite configurável e registro da decisão |
| Prova da mensagem | Sim, com exemplo fixo | Renderização por destinatário e sanitização |
| Criação de rascunhos | Simulação temporizada | Worker idempotente e Gmail API |
| Textos-base | Seleção e editor visual | CRUD, versionamento e autorização |
| Contas Gmail | Cartões demonstrativos | Google OAuth, renovação e revogação |
| Histórico e exportação | Dados e ação demonstrativos | Consulta, paginação e arquivo exportável |
| Responsividade | Sim | Testes em matriz de navegadores |
| Acessibilidade | Estrutura inicial com ARIA, foco e redução de movimento | Auditoria WCAG e testes assistivos |

