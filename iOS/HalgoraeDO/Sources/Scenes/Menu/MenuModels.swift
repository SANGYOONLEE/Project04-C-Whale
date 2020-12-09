//
//  MenuModels.swift
//  HalgoraeDO
//
//  Created by woong on 2020/12/08.
//

import Foundation

enum MenuModels {
    
    // MARK: - Usecase
    
    enum FetchProjects {
        struct Request {
            
        }
        
        struct Response {
            var projects: [Project]
        }
        
        struct ViewModel {
            var projects = [ProjectSection: [ProjectVM]]()
            
            init(projects origins: [Project]) {
                self.projects = generateViewModels(for: origins)
            }
            
            func generateViewModels(for projects: [Project]) -> [ProjectSection: [ProjectVM]] {
                var viewModels = [ProjectSection: [ProjectVM]]()
                for section in ProjectSection.allCases {
                    switch section {
                        case .normal:
                            viewModels[section] = [ProjectVM(title: "오늘", isHeader: false)]
                        case .project:
                            viewModels[section] = [ProjectVM(title: "프로젝트", isHeader: true)]
                    }
                }
                
                for project in projects {
                    guard project.title != "오늘" else {
                        viewModels[.normal]?[0].taskCount = project.taskCount
                        continue
                    }
                    
                    viewModels[.project]?[0].taskCount += project.taskCount
                    viewModels[.project]?.append(.init(project: project))
                    
                    if project.isFavorite ?? false {
                        viewModels[.normal]?.append(.init(project: project, makeFavorite: true))
                    }
                }
                return viewModels
            }
        }
    }
    
    enum UpdateProject {
        struct Request {
            var project: ProjectVM
        }
        
        struct Response {
            var project: Project
        }
        
        struct ViewModel {
            var favorite: ProjectVM
            var project: ProjectVM
        }
    }
}

extension MenuModels {
    
    enum ProjectSection: Int, Hashable, CaseIterable, CustomStringConvertible {
        case normal = 0, project
        var description: String {
            switch self {
            case .normal: return ""
            case .project: return "프로젝트"
            }
        }
    }
    
    struct ProjectVM: Hashable {
        var id: String
        var title: String
        var color: String
        var taskCount: Int
        var isFavorite: Bool
        var isHeader: Bool = false
        
        init(id: String = UUID().uuidString,
            title: String = "",
            color: String = "#BDBDBD",
            taskCount: Int = 0,
            isFavorite: Bool = false,
            isHeader: Bool = false) {
            
            self.id = id
            self.title = title
            self.color = color
            self.taskCount = taskCount
            self.isFavorite = isFavorite
            self.isHeader = isHeader
        }
        
        init(project: Project, makeFavorite: Bool = false) {
            self.id = project.id ?? UUID().uuidString
            self.title = project.title
            self.color = "#BDBDBD"
            self.taskCount = project.taskCount
            self.isFavorite = project.isFavorite ?? false
            
            if makeFavorite {
                self.id += "+"
            }
        }
        
        func hash(into hasher: inout Hasher) {
            hasher.combine(id)
        }
        
        static func ==(lhs: Self, rhs: Self) -> Bool {
            return lhs.id == rhs.id
        }
    }
}