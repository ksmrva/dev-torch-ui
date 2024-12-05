import { Injectable } from '@angular/core';
import { CodeModelSourceFileService } from '../code-model-source-file.service';

export const ICON_PATH_BASE: string = "assets/images/icons/atom";

/* Folder Icons */
export const GENERIC_FILE_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/any_type.svg";
export const FOLDER_ICON_PATH: string = ICON_PATH_BASE + "/icons/expui/toolwindows/fileSystem.svg";
// export const GENERIC_FILE_ICON_PATH: string = ICON_PATH_BASE + "/glyphs/plugins/resharper/Services/FileTemplate.svg";
// export const FOLDER_ICON_PATH: string = ICON_PATH_BASE + "/actions/folder.svg";
export const ANY_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/any_type.svg";
export const UNKNOWN_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/unknown.svg";

/* Icons with no matching Extension */
export const JAVAOUTSIDESOURCE_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/javaOutsideSource.svg";
export const MARKDOWNPLUGIN_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/MarkdownPlugin.svg";
export const MODULEMAP_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/moduleMap.svg";
export const REGEXP_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/regexp.svg";

/* Icons with matching Extension */
export const ARCHIVE_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/archive.svg";
export const ZIP_FILE_EXTENSION: string = "zip";
export const SEVEN_ZIP_FILE_EXTENSION: string = "7z";
export const JAR_FILE_EXTENSION: string = "jar";
export const TAR_FILE_EXTENSION: string = "tar";

export const AS_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/as.svg";
export const AS_FILE_EXTENSION: string = "as";

export const ASM_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/asm.svg";
export const ASM_FILE_EXTENSION: string = "asm";

export const ASPECTJ_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/aspectj.svg";
export const ASPECTJ_FILE_EXTENSION: string = "aspectj";

export const C_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/c.svg";
export const C_FILE_EXTENSION: string = "c";

export const CONFIG_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/config.svg";
export const CONFIG_FILE_EXTENSION: string = "config";

export const CPLUSPLUS_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/cpp.svg";
export const CPLUSPLUS_FILE_EXTENSION: string = "cpp";

export const CSS_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/css.svg";
export const CSS_FILE_EXTENSION: string = "css";

export const CU_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/cu.svg";
export const CU_FILE_EXTENSION: string = "cu";

export const CUDA_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/cuda.svg";
export const CUDA_FILE_EXTENSION: string = "cuda";

export const CUDAHEADER_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/cudaHeader.svg";
export const CUDAHEADER_FILE_EXTENSION: string = "cudah";

export const CUH_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/cuh.svg";
export const CUH_FILE_EXTENSION: string = "cuh";

export const CUSTOM_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/custom.svg";
export const CUSTOM_FILE_EXTENSION: string = "custom";

export const DIAGRAM_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/diagram.svg";
export const DIAGRAM_FILE_EXTENSION: string = "diagram";

export const DTD_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/dtd.svg";
export const DTD_FILE_EXTENSION: string = "dtd";

export const H_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/h.svg";
export const H_FILE_EXTENSION: string = "h";

export const HPROF_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/hprof.svg";
export const HPROF_FILE_EXTENSION: string = "hprof";

export const HTACCESS_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/htaccess.svg";
export const HTACCESS_FILE_EXTENSION: string = "htaccess";

export const HTML_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/html.svg";
export const HTML_FILE_EXTENSION: string = "html";

export const I18N_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/i18n.svg";
export const I18N_FILE_EXTENSION: string = "i18n";

export const IDL_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/idl.svg";
export const IDL_FILE_EXTENSION: string = "idl";

export const JAVA_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/java.svg";
export const JAVA_FILE_EXTENSION: string = "java";

export const JAVACLASS_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/javaClass.svg";
export const JAVACLASS_FILE_EXTENSION: string = "class";

export const JAVASCRIPT_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/javaScript.svg";
export const JAVASCRIPT_FILE_EXTENSION: string = "js";

export const JFR_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/jfr.svg";
export const JFR_FILE_EXTENSION: string = "jfr";

export const JSON_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/json.svg";
export const JSON_FILE_EXTENSION: string = "json";

export const JSONSCHEMA_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/jsonSchema.svg";
export const JSONSCHEMA_FILE_EXTENSION: string = "schema";

export const JSP_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/jsp.svg";
export const JSP_FILE_EXTENSION: string = "jsp";

export const JSPX_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/jspx.svg";
export const JSPX_FILE_EXTENSION: string = "jspx";

export const M_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/m.svg";
export const M_FILE_EXTENSION: string = "m";

export const MANIFEST_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/manifest.svg";
export const MANIFEST_FILE_EXTENSION: string = "manifest";

export const MDX_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/mdx.svg";
export const MDX_FILE_EXTENSION: string = "mdx";

export const MICROSOFT_WINDOWS_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/microsoftWindows.svg";
export const WINDOWS_BATCH_FILE_EXTENSION: string = "bat";
export const WINDOWS_COMMAND_FILE_EXTENSION: string = "cmd";

export const MM_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/mm.svg";
export const MM_FILE_EXTENSION: string = "mm";

export const PLIST_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/plistFile.svg";
export const PLIST_FILE_EXTENSION: string = "plist";

export const PROPERTIES_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/properties.svg";
export const PROPERTIES_FILE_EXTENSION: string = "properties";

export const TEXT_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/text.svg";
export const TEXT_FILE_EXTENSION: string = "txt";

export const TYPESCRIPT_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/typescript.svg";
export const TYPESCRIPT_FILE_EXTENSION: string = "tss";

export const UIFORM_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/uiForm.svg";
export const UIFORM_FILE_EXTENSION: string = "uiform";

export const WSDL_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/wsdlFile.svg";
export const WSDL_FILE_EXTENSION: string = "wsdl";

export const XHTML_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/xhtml.svg";
export const XHTML_FILE_EXTENSION: string = "xhtml";

export const XML_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/xml.svg";
export const XML_FILE_EXTENSION: string = "xml";

export const XSD_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/xsdFile.svg";
export const XSD_FILE_EXTENSION: string = "xsd";

export const YAML_ICON_PATH: string = ICON_PATH_BASE + "/files/fileTypes/yaml.svg";
export const YML_FILE_EXTENSION: string = "yml";
export const YAML_FILE_EXTENSION: string = "yaml";

export const MARKDOWN_ICON_PATH: string = ICON_PATH_BASE + "/files/other/expui/markdown.svg";
export const MARKDOWN_FILE_EXTENSION: string = "md";

export const INTELLIJ_ICON_PATH: string = ICON_PATH_BASE + "/icons/nodes/ideaModule.svg";
export const INTELLIJ_FILE_EXTENSION: string = "iml";

@Injectable({
  providedIn: 'root'
})
export class CodeModelSourceFileIconService {

  constructor(
    private codeModelSourceFileService: CodeModelSourceFileService
  ) { }

  getIconPathFromFileName(fileName: string, isDirectory: boolean): string {
    let iconPath = GENERIC_FILE_ICON_PATH;

    if(fileName === "") {
      // Get default icon
    } else {

      if(isDirectory) {
        iconPath = FOLDER_ICON_PATH;
      } else {
        this.codeModelSourceFileService.extractFileExtensionFromName(fileName);

        let indexOfLastPeriod = fileName.lastIndexOf(".");
        if(indexOfLastPeriod > 0 && indexOfLastPeriod < fileName.length) {
          let fileExtension = fileName.substring(indexOfLastPeriod + 1);
          switch (fileExtension) {
            case AS_FILE_EXTENSION:
              iconPath = GENERIC_FILE_ICON_PATH;
              break;

            case ASM_FILE_EXTENSION:
              iconPath = ASM_ICON_PATH;
              break;

            case ASPECTJ_FILE_EXTENSION:
              iconPath = ASPECTJ_ICON_PATH;
              break;

            case C_FILE_EXTENSION:
              iconPath = C_ICON_PATH;
              break;

            case CONFIG_FILE_EXTENSION:
              iconPath = CONFIG_ICON_PATH;
              break;

            case CPLUSPLUS_FILE_EXTENSION:
              iconPath = CPLUSPLUS_ICON_PATH;
              break;

            case CSS_FILE_EXTENSION:
              iconPath = CSS_ICON_PATH;
              break;

            case CU_FILE_EXTENSION:
              iconPath = CU_ICON_PATH;
              break;

            case CUDA_FILE_EXTENSION:
              iconPath = CUDA_ICON_PATH;
              break;

            case CUDAHEADER_FILE_EXTENSION:
              iconPath = CUDAHEADER_ICON_PATH;
              break;

            case CUH_FILE_EXTENSION:
              iconPath = CUH_ICON_PATH;
              break;

            case CUSTOM_FILE_EXTENSION:
              iconPath = CUSTOM_ICON_PATH;
              break;

            case DIAGRAM_FILE_EXTENSION:
              iconPath = DIAGRAM_ICON_PATH;
              break;

            case DTD_FILE_EXTENSION:
              iconPath = DTD_ICON_PATH;
              break;

            case H_FILE_EXTENSION:
              iconPath = H_ICON_PATH;
              break;

            case HPROF_FILE_EXTENSION:
              iconPath = HPROF_ICON_PATH;
              break;

            case HTACCESS_FILE_EXTENSION:
              iconPath = HTACCESS_ICON_PATH;
              break;

            case HTML_FILE_EXTENSION:
              iconPath = HTML_ICON_PATH;
              break;

            case I18N_FILE_EXTENSION:
              iconPath = I18N_ICON_PATH;
              break;

            case IDL_FILE_EXTENSION:
              iconPath = IDL_ICON_PATH;
              break;

            case JAVA_FILE_EXTENSION:
              iconPath = JAVA_ICON_PATH;
              break;

            case JAVACLASS_FILE_EXTENSION:
              iconPath = JAVACLASS_ICON_PATH;
              break;

            case JAVASCRIPT_FILE_EXTENSION:
              iconPath = JAVASCRIPT_ICON_PATH;
              break;

            case JFR_FILE_EXTENSION:
              iconPath = JFR_ICON_PATH;
              break;

            case JSON_FILE_EXTENSION:
              iconPath = JSON_ICON_PATH;
              break;

            case JSONSCHEMA_FILE_EXTENSION:
              iconPath = JSONSCHEMA_ICON_PATH;
              break;

            case JSP_FILE_EXTENSION:
              iconPath = JSP_ICON_PATH;
              break;

            case JSPX_FILE_EXTENSION:
              iconPath = JSPX_ICON_PATH;
              break;

            case M_FILE_EXTENSION:
              iconPath = M_ICON_PATH;
              break;

            case MANIFEST_FILE_EXTENSION:
              iconPath = MANIFEST_ICON_PATH;
              break;

            case MDX_FILE_EXTENSION:
              iconPath = MDX_ICON_PATH;
              break;

            case WINDOWS_BATCH_FILE_EXTENSION:
            case WINDOWS_COMMAND_FILE_EXTENSION:
              iconPath = MICROSOFT_WINDOWS_ICON_PATH;
              break;

            case MM_FILE_EXTENSION:
              iconPath = MM_ICON_PATH;
              break;

            case PLIST_FILE_EXTENSION:
              iconPath = PLIST_ICON_PATH;
              break;

            case PROPERTIES_FILE_EXTENSION:
              iconPath = PROPERTIES_ICON_PATH;
              break;

            case TEXT_FILE_EXTENSION:
              iconPath = TEXT_ICON_PATH;
              break;

            case TYPESCRIPT_FILE_EXTENSION:
              iconPath = TYPESCRIPT_ICON_PATH;
              break;

            case UIFORM_FILE_EXTENSION:
              iconPath = UIFORM_ICON_PATH;
              break;

            case WSDL_FILE_EXTENSION:
              iconPath = WSDL_ICON_PATH;
              break;

            case XHTML_FILE_EXTENSION:
              iconPath = XHTML_ICON_PATH;
              break;

            case XML_FILE_EXTENSION:
              iconPath = XML_ICON_PATH;
              break;

            case XSD_FILE_EXTENSION:
              iconPath = XSD_ICON_PATH;
              break;

            case YML_FILE_EXTENSION:
            case YAML_FILE_EXTENSION:
              iconPath = YAML_ICON_PATH;
              break;

            case ZIP_FILE_EXTENSION:
            case SEVEN_ZIP_FILE_EXTENSION:
            case TAR_FILE_EXTENSION:
            case JAR_FILE_EXTENSION:
              iconPath = ARCHIVE_ICON_PATH;
              break;

            case MARKDOWN_FILE_EXTENSION:
              iconPath = MARKDOWN_ICON_PATH;
              break;

            case INTELLIJ_FILE_EXTENSION:
              iconPath = INTELLIJ_ICON_PATH;
              break;

            default:
              console.warn("No matching File Extension for value [" + fileExtension + "]");
          }
        }
      }
    }
    return iconPath;
  }

}
