import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { BaseApiService } from '../../../base.api.service';
import { HttpClient } from '@angular/common/http';
import { StringUtil } from '../../../../entity/helper/string/util/string-util';
import { CodeProject } from '../../../../entity/model/code/project/code-project';

@Injectable({
  providedIn: 'root'
})
export class CodeModelProjectService extends BaseApiService {

  private projects$: BehaviorSubject<CodeProject[]>;

  private projectNames$: BehaviorSubject<string[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.projects$ = new BehaviorSubject<CodeProject[]>([]);
    this.projectNames$ = new BehaviorSubject<string[]>([]);

    this.initProjectNames();
  }

  getProjectNames(): Observable<string[]> {
    return this.projectNames$.asObservable();
  }

  getProject(projectNameToGet: string): Observable<CodeProject | undefined> {
    let projectResult: Observable<CodeProject | undefined>;

    let loadedProject = this.getProjectFromCache(projectNameToGet);
    if (loadedProject) {
      projectResult = of(loadedProject);

    } else {
      console.info("Code Project with name [" + projectNameToGet + "] not found within cache, fetching from API");
      projectResult = this.getProjectApiCall(projectNameToGet);

    }
    return projectResult;
  }

  protected override getResourcePathForApiUrl(): string {
    return "/model/code/project";
  }

  private initProjectNames(): void {
    this.getAllProjectNamesApiCall().subscribe({
                                    next: (projectNames: string[] | undefined) => {
                                      if (!projectNames) {
                                        throw new Error("Failed to initialize the Code Project Names");
                                      }
                                    },
                                    error: (err: any) => {
                                      throw new Error("Failed to initialize the Code Project Names due to [" + err + "]");
                                    },
                                    complete: () => {
                                      console.log("Finished initializing Code Project Names");
                                    }
                                  });
  }

  private getProjectFromCache(projectNameToGet: string): CodeProject | undefined {
    return this.projects$.value.find((project: CodeProject) => {
      return project.name === projectNameToGet;
    });
  }

  private addProjectName(projectNameToAdd: string): void {
    if (StringUtil.isNotEmpty(projectNameToAdd)) {
      let projectNameAlreadyAdded = this.projectNames$.value.find((projectName: string) => {
        return projectName === projectNameToAdd;
      });
      if (StringUtil.isEmpty(projectNameAlreadyAdded)) {
        this.projectNames$.next([...this.projectNames$.value, projectNameToAdd]);
      }
    }
  }

  private addProject(projectToAdd: CodeProject): void {
    if(projectToAdd) {
      let projectNameToAdd = projectToAdd.name;
      if (StringUtil.isNotEmpty(projectNameToAdd)) {
        let projectAlreadyAdded = this.projects$.value.find((project: CodeProject) => {
          return project.name === projectNameToAdd;
        });
        if (!projectAlreadyAdded) {
          this.projects$.next([...this.projects$.value, projectToAdd]);
          this.addProjectName(projectNameToAdd);
        }
      }
    }
  }

  private getAllProjectNamesApiCall(): Observable<string[] | undefined> {
    return this.httpClient.get<string[]>(this.getApiUrlWithAddition("name"))
                          .pipe(
                            map((getAllProjectNamesResult: string[]) => {
                              let projectNames: string[] = [];
                              getAllProjectNamesResult.forEach((projectNameResult: string) => {
                                projectNames.push(projectNameResult);
                              });
                              return projectNames;
                            }),
                            catchError((error) => {
                              console.error("Failed to get all Code Project Names due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((allProjectNames: string[] | undefined) => {
                              if (allProjectNames) {
                                allProjectNames.forEach((projectName: string) => {
                                  this.addProjectName(projectName);
                                });
                              }
                            })
                          );
  }

  private getProjectApiCall(projectNameToGet: string): Observable<CodeProject | undefined> {
    return this.httpClient.get<CodeProject>(this.getApiUrlWithAddition(projectNameToGet))
                          .pipe(
                            map((projectResult: CodeProject) => {
                              return new CodeProject().deserialize(projectResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to get the Code Model Project with name [" + projectNameToGet + "] due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((project: CodeProject | undefined) => {
                              if (project) {
                                this.addProject(project);
                              }
                            })
                          );
  }

}
