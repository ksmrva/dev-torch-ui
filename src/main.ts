import { bootstrapApplication } from "@angular/platform-browser";
import { DevTorchRootComponent } from "./app/component/root/dev-torch-root.component";
import { appConfig } from "./app/app.config";

bootstrapApplication(DevTorchRootComponent, appConfig).catch((err) =>
  console.error(err)
);
