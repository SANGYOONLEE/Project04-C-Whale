//
//  TaskDetailViewController.swift
//  HalgoraeDO
//
//  Created by woong on 2020/12/01.
//

import UIKit

protocol TaskDetailDisplayLogic {
    
}

class TaskDetailViewController: UIViewController {
    
    // MARK: - Properties
    
    private var task: Task
    
    // MARK: Views

    @IBOutlet weak private var navigationView: UIView!
    @IBOutlet weak private var navigationBar: UINavigationBar!
    @IBOutlet weak private var titleLabel: UILabel!
    @IBOutlet weak private var subContainerView: UIView!
    
    // MARK: View Life Cycle
    
    init?(coder: NSCoder, task: Task) {
        self.task = task
        super.init(coder: coder)
    }
    
    required init?(coder: NSCoder) {
        self.task = Task(title: "")
        super.init(coder: coder)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        titleLabel.text = "Project"
    }
    
    // MARK: - Methods
    
    // MARK: IBActions
    
    @IBAction private func didTapSubTasksTabButton(_ sender: UIButton) {
        
    }
    
    @IBAction private func didTapCommentTabButton(_ sender: UIButton) {
        
    }
    
    @IBAction private func didTapBookmarkButton(_ sender: UIButton) {
        
    }
}

extension TaskDetailViewController: TaskDetailDisplayLogic {
    
}