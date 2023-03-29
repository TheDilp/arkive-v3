import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";

import { WebhookType } from "../../types/generalTypes";

export default function Webhook({ title, url }: Pick<WebhookType, "title" | "url">) {
  const [webHookTitle, setWebhookTitle] = useState(title);
  return (
    <div className="flex w-full justify-center gap-x-6">
      <InputText
        autoComplete="false"
        className="w-1/3"
        inputMode="text"
        name="Webhook title"
        onChange={(e) => setWebhookTitle(e.target.value)}
        placeholder="Webhook title"
        value={webHookTitle}
      />
      <Password
        autoComplete="false"
        className="w-1/3"
        disabled
        feedback={false}
        inputClassName="w-full"
        name="Webhook url"
        placeholder="Webhook url"
        toggleMask
        type="text"
        value={url}
      />
      <Button
        className="p-button-outlined p-button-success w-1/6"
        disabled
        icon="pi pi-plus"
        iconPos="right"
        label="Update webhook"
        // onClick={() => {
        //   if (localData?.id) createWebhookMutation({ user_id: localData.id, title: newWebhook.title, url: newWebhook.url });
        // }}
      />
      <Button
        className="p-button-outlined p-button-danger w-1/6"
        disabled
        icon="pi pi-plus"
        iconPos="right"
        label="Update webhook"
        // onClick={() => {
        //   if (localData?.id) createWebhookMutation({ user_id: localData.id, title: newWebhook.title, url: newWebhook.url });
        // }}
      />
    </div>
  );
}
