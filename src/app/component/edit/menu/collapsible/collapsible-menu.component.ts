import { CommonModule } from "@angular/common";
import { Component, OnInit, Input, Output, EventEmitter, Inject, ChangeDetectorRef, SimpleChanges, OnChanges } from "@angular/core";
import { BaseComponent } from "../../../base.component";

declare var $: any;

@Component({
  selector: "collapsible-menu",
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: "./collapsible-menu.component.html",
  styleUrl: "./collapsible-menu.component.scss"
})
export class CollapsibleMenuComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() menuContentIsClosed: boolean;

  @Input() baseHtmlId: string;

  @Input() menuTitle: string;

  @Input() isSubMenu: boolean;

  @Input() showBottomPadding: boolean;

  @Output() menuToggleEvent: EventEmitter<boolean>;

  menuContentHtmlId: string;

  menuContentHolderHtmlId: string;

  jQuerySelectorIdForMenuContent: string;

  containerClasses: string;

  additionalContentHolderClasses: string;

  additionalTitleClasses: string;

  additionalLabelClasses: string;

  additionalLabelNameClasses: string;

  additionalLabelIconClasses: string;

  constructor(
    @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef
  ) {
    super();
    this.menuContentIsClosed = true;
    this.baseHtmlId = "";
    this.menuTitle = "";
    this.isSubMenu = false;
    this.showBottomPadding = false;
    this.menuToggleEvent = new EventEmitter<boolean>();

    this.menuContentHtmlId = "";
    this.menuContentHolderHtmlId = "";
    this.jQuerySelectorIdForMenuContent = "";
    this.containerClasses = "";
    this.additionalContentHolderClasses = "";
    this.additionalTitleClasses = "";
    this.additionalLabelClasses = "";
    this.additionalLabelNameClasses = "";
    this.additionalLabelIconClasses = "";
  }

  ngOnInit(): void {
    this.menuContentHtmlId = this.baseHtmlId + "_Content";
    this.menuContentHolderHtmlId = this.menuContentHtmlId + "_Holder";
    this.jQuerySelectorIdForMenuContent = "#" + this.menuContentHolderHtmlId;

    this.initContainerClasses();
    this.initAdditionalContentHolderClasses();
    this.initAdditionalTitleClasses();
    this.initAdditionalLabelClasses();
    this.initAdditionalLabelNameClasses();
    this.initAdditionalLabelIconClasses();
  }

  ngAfterViewInit(): void {
    this.determineMenuContentDisplay();

    // Initialize the border bottom depending on if the Menu Content is currently shown or not
    if (!this.isCurrentlyCollapsed()) {
      this.addBorderBottomToTitle();
    }

    // Add listeners for when the Menu Content is collapsed or opened
    $(this.jQuerySelectorIdForMenuContent).on("show.bs.collapse", (e: any) => {
      if(e.target.id === this.menuContentHolderHtmlId) {
        this.addBorderBottomToTitle();
      }
    });
    $(this.jQuerySelectorIdForMenuContent).on("hidden.bs.collapse", (e: any) => {
      if(e.target.id === this.menuContentHolderHtmlId) {
        this.removeBorderBottomToTitle();
      }
    });

    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.determineMenuContentDisplay();
  }

  menuToggleClicked(): void {
    this.menuToggleEvent.emit(true);
  }

  determineMenuContentDisplay(): void {
    if (this.menuContentIsClosed) {
      this.closeMenuContent();

    } else {
      this.showMenuContent();

    }
    this.initAdditionalLabelNameClasses();
    this.initAdditionalContentHolderClasses();
    this.initAdditionalLabelIconClasses();
  }

  closeMenuContent(): void {
    if (!this.isCurrentlyCollapsed()) {
      $(this.jQuerySelectorIdForMenuContent).collapse("hide");
    }
  }

  showMenuContent(): void {
    if (this.isCurrentlyCollapsed()) {
      $(this.jQuerySelectorIdForMenuContent).collapse("show");
    }
  }

  private initContainerClasses(): void {
    if(this.isSubMenu) {
      this.containerClasses = "";
    } else {
      this.containerClasses = "border-bottom border-3";
    }
  }

  private initAdditionalContentHolderClasses(): void {
    if(this.isSubMenu) {
      this.additionalContentHolderClasses = "pt-1";
      if (!this.menuContentIsClosed) {
        this.additionalContentHolderClasses += " ";
      }
    } else {
      this.additionalContentHolderClasses = "pt-1";
    }

    if(this.showBottomPadding) {
      this.additionalContentHolderClasses += " pb-3";
    }
  }

  private initAdditionalTitleClasses(): void {
    if(this.isSubMenu) {
      this.additionalTitleClasses = "ps-3 pe-2 pt-2 pb-1";
    } else {
      this.additionalTitleClasses = "ps-2 pe-2 pt-2 pb-1";
    }
  }

  private initAdditionalLabelClasses(): void {
    if(this.isSubMenu) {
      this.additionalLabelClasses = "justify-content-between";
    } else {
      this.additionalLabelClasses = "justify-content-between";
    }
  }

  private initAdditionalLabelNameClasses(): void {
    if(this.isSubMenu) {
      this.additionalLabelNameClasses = "h5";
    } else {
      this.additionalLabelNameClasses = "h4";
    }
    if (this.menuContentIsClosed) {
      this.additionalLabelNameClasses += " sidebar-menu-title-primary";
    } else {
      this.additionalLabelNameClasses += " sidebar-menu-label-activated-primary";
    }
  }

  private initAdditionalLabelIconClasses(): void {
    if (this.menuContentIsClosed) {
      this.additionalLabelIconClasses = "bi-chevron-down";
    } else {
      this.additionalLabelIconClasses = "bi-chevron-up";
    }
  }

  private addBorderBottomToTitle(): void {
    if(this.isSubMenu) {
      this.additionalTitleClasses += " border-bottom menu-title-shadow";
    } else {
      this.additionalTitleClasses += " border-bottom menu-title-shadow";
    }
  }

  private removeBorderBottomToTitle(): void {
    this.initAdditionalTitleClasses();
  }

   private isCurrentlyCollapsed(): boolean {
    return !$(this.jQuerySelectorIdForMenuContent).hasClass("show");
  }

}
