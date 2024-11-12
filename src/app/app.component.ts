import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, AfterViewInit, Inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { APP_LOGO_PATH } from "./app.constants";
import { CanvasViewerComponent } from "./component/canvas/viewer/canvas-viewer.component";


@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CanvasViewerComponent
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss"
})
export class AppComponent implements AfterViewInit {

  htmlIdBase: string;

  bannerBarBottomHtmlId: string;

  titleStart: string;

  titleEnd: string;

  appVersion: string;

  darkMode: boolean;

  logoPath: string;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
    this.htmlIdBase = "AppRoot";
    this.bannerBarBottomHtmlId = this.htmlIdBase + "_BannerBar_Bottom";
    this.titleStart = "dev";
    this.titleEnd = "Torch";
    // TODO: Fetch this from the package.json file instead, maybe using https://www.npmjs.com/package/genversion
    this.appVersion = "0.0.1";
    this.darkMode = true;
    this.logoPath = APP_LOGO_PATH;
  }

  ngAfterViewInit(): void {
    this.addEventListenerForDarkModeSwitch();
  }

  private addEventListenerForDarkModeSwitch(): void {
    this.document.addEventListener("DOMContentLoaded", (event) => {
      const htmlElement = this.document.documentElement;
      if (htmlElement) {
        const switchElement: any = this.document.getElementById(this.htmlIdBase + "_BannerBar_Top_DarkMode_Switch_Input");
        if (switchElement) {
          // Set the default theme to dark if no setting is found in local storage
          const currentTheme = localStorage.getItem("bsTheme") || "dark";
          htmlElement.setAttribute("data-bs-theme", currentTheme);
          switchElement.checked = currentTheme === "dark";

          switchElement.addEventListener("change", () => {
            if (switchElement.checked) {
              htmlElement.setAttribute("data-bs-theme", "dark");
              localStorage.setItem("bsTheme", "dark");
              this.darkMode = true;
            } else {
              htmlElement.setAttribute("data-bs-theme", "light");
              localStorage.setItem("bsTheme", "light");
              this.darkMode = false;
            }
          });
        }
      }
    });
  }
}
