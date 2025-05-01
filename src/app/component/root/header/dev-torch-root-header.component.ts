import { AfterViewInit, Component, Inject } from '@angular/core';
import { APP_LOGO_PATH } from '../../../app.constants';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dev-torch-root-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dev-torch-root-header.component.html',
  styleUrl: './dev-torch-root-header.component.scss'
})
export class DevTorchRootHeaderComponent implements AfterViewInit {

  baseHtmlId: string;

  headerTopHtmlId: string;

  headerBottomHtmlId: string;

  titleStart: string;

  titleEnd: string;

  darkMode: boolean;

  logoPath: string;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
      this.baseHtmlId = "devTorchHeader";
      this.headerTopHtmlId = this.baseHtmlId + "_Top";
      this.headerBottomHtmlId = this.baseHtmlId + "_Bottom";
      this.titleStart = "dev";
      this.titleEnd = "Torch";
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
          const switchElement: any = this.document.getElementById(this.headerTopHtmlId + "_DarkMode_Switch_Input");
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
