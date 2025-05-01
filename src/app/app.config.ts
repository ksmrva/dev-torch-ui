import { provideHttpClient } from "@angular/common/http";
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { provideMonacoEditor } from "ngx-monaco-editor-v2";
import { EXPLORER_PANEL_LIST_ICON_PROVIDER_INJECTION_TOKEN } from "./service/shared/explorer/panel/list/icon/provider/explorer-panel-list-icon-provider";
import { CodeModelSourceFileIconService } from "./service/model/code/source/file/icon/code-model-source-file-icon.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideMonacoEditor(),
    { provide: EXPLORER_PANEL_LIST_ICON_PROVIDER_INJECTION_TOKEN, useClass: CodeModelSourceFileIconService, multi: true }
  ]
};
