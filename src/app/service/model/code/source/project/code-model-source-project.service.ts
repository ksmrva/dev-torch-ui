import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { BaseApiService } from '../../../../shared/base.api.service';
import { HttpClient } from '@angular/common/http';
import { StringUtil } from '../../../../../entity/shared/string/util/string-util';
import { CodeModelSourceProject } from '../../../../../entity/model/code/source/project/code-model-source-project';
import { CodeModelSourceProjectCreateArgs } from '../../../../../entity/model/code/source/project/create/code-model-source-project-create-args';

@Injectable({
  providedIn: 'root'
})
export class CodeModelSourceProjectService extends BaseApiService {

  private projects$: BehaviorSubject<CodeModelSourceProject[]>;

  private projectNames$: BehaviorSubject<string[]>;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
    this.projects$ = new BehaviorSubject<CodeModelSourceProject[]>([]);
    this.projectNames$ = new BehaviorSubject<string[]>([]);

    this.initProjectNames();
  }

  override getResourcePathForApiUrl(): string {
    return "/model/code/source/project";
  }

  getProjectNames(): Observable<string[]> {
    return this.projectNames$.asObservable();
  }

  getProject(projectNameToGet: string): Observable<CodeModelSourceProject | undefined> {
    let projectResult: Observable<CodeModelSourceProject | undefined>;

    let loadedProject = this.getProjectFromCache(projectNameToGet);
    if (loadedProject) {
      projectResult = of(loadedProject);

    } else {
      console.info("Code Model Source Project with name [" + projectNameToGet + "] not found within cache, fetching from API");
      projectResult = this.getProjectApiCall(projectNameToGet);

    }
    return projectResult;
  }

  createProject(projectCreateArgs: CodeModelSourceProjectCreateArgs): Observable<CodeModelSourceProject | undefined> {
    let createProjectObservable;

    if(
      projectCreateArgs
    && StringUtil.isNotEmpty(projectCreateArgs.name)
    && StringUtil.isNotEmpty(projectCreateArgs.path)) {
      createProjectObservable = this.createProjectApiCall(projectCreateArgs);

    } else {
      createProjectObservable = of(undefined);
    }

    return createProjectObservable;
  }

  private initProjectNames(): void {
    this.getAllProjectNamesApiCall().subscribe({
                                    next: (projectNames: string[] | undefined) => {
                                      if (!projectNames) {
                                        throw new Error("Failed to initialize the Code Model Source Project Names");
                                      }
                                    },
                                    error: (err: any) => {
                                      throw new Error("Failed to initialize the Code Model Source Project Names due to [" + err + "]");
                                    },
                                    complete: () => {
                                      console.log("Finished initializing Code Model Source Project Names");
                                    }
                                  });
  }

  private getProjectFromCache(projectNameToGet: string): CodeModelSourceProject | undefined {
    return this.projects$.value.find((project: CodeModelSourceProject) => {
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

  private addProject(projectToAdd: CodeModelSourceProject): void {
    if(projectToAdd) {
      let projectNameToAdd = projectToAdd.name;
      if (StringUtil.isNotEmpty(projectNameToAdd)) {
        let projectAlreadyAdded = this.projects$.value.find((project: CodeModelSourceProject) => {
          return project.name === projectNameToAdd;
        });
        if (!projectAlreadyAdded) {
          this.projects$.next([...this.projects$.value, projectToAdd]);
          this.addProjectName(projectNameToAdd);
        }
      }
    }
  }

  private createProjectApiCall(createProjectArgs: CodeModelSourceProjectCreateArgs): Observable<CodeModelSourceProject | undefined> {
    return this.httpClient.post<CodeModelSourceProject>(this.getApiUrl(), createProjectArgs)
                          .pipe(
                            map((createProjectResult: CodeModelSourceProject) => {
                              return new CodeModelSourceProject().deserialize(createProjectResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to create the Code Model Source Project with name [" + createProjectArgs.name + "] and path [" + createProjectArgs.path + "] due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((project: CodeModelSourceProject | undefined) => {
                              if (project) {
                                this.addProject(project);
                              }
                            })
                          );
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
                              console.error("Failed to get all Code Model Source Project Names due to [" + error + "]", error);
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

  private getProjectApiCall(projectNameToGet: string): Observable<CodeModelSourceProject | undefined> {
    return this.httpClient.get<CodeModelSourceProject>(this.getApiUrlWithAddition(projectNameToGet))
                          .pipe(
                            map((projectResult: CodeModelSourceProject) => {
                              return new CodeModelSourceProject().deserialize(projectResult);
                            }),
                            catchError((error) => {
                              console.error("Failed to get the Code Model Source Project with name [" + projectNameToGet + "] due to [" + error + "]", error);
                              return of(undefined);
                            })
                          )
                          .pipe(
                            tap((project: CodeModelSourceProject | undefined) => {
                              if (project) {
                                this.addProject(project);
                              }
                            })
                          );
  }

}
