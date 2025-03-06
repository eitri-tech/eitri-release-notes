# Eitri Developer Overview

## Release - 24/02/2025

## Sobre a release

A release do dia 24/02/2025 atualiza a Eitri Machine no Android para o targetSdk 34, que equivale à versão 14 do SO. Com isso, a machine terá compatibilidade a novos recursos do Android! 
Uma série de novas funcionalidades também foram disponibilizadas ao desenvolvedor, como listagem e remoção de notificações agendadas, suporte para intentFlags em run e RunInput, funções de reload de um eitri-app e simulação de bottom bar no Eitri Play para desenvolvimento de múlitplos workspaces.
Uma série de correções também foi feita para melhorar a qualidade dos eitri-apps, como a eliminação de um memory leak no uso da bottom bar, correção do número de versão dos apps gerados pelo app generator e a correção de modal de confirmação no Eitri Doctor.

---

## Eitri Machine v.3.3.0

### Novas features

### Suporte para intentFlags em run e RunInput

No Android, agora o modelo `RunInput` tem a propriedade `#!kotlin intentFlags: Int?`, usada no método `run` da classe `SuperApp` para fazer a execução com a passagem de um intent.

### Listagem e cancelamento de notificações agendadas

Agora é possível listar e remover as notificações que foram agendadas por `#!js async Eitri.notification.sendLocalPush()`. Isso é feito através de dois novos métodos, `#!js async Eitri.notification.listLocalPushes(): Promise<NotificationSchedules>` e `#!js async Eitri.notification.cancelLocalPush(): Promise<void>`.
Um exemplo de utilização de listLocalPushes é como tal:

```js
let localPushes = await Eitri.notification.listLocalPushes();
console.log(localPushes);

/* Example output from this console.log:
{
  schedules: [
    { nextOccurrence: "Feb 14, 2025 4:07:58 PM", notification: {...} },
    { nextOccurrence: "Feb 15, 2025 10:00:00 AM", notification: {...} }
  ]
}
*/
```

Já `cancelLocalPush` é usado da seguinte forma:

```js
await Eitri.notification.cancelLocalPush({ id: "1" });
```