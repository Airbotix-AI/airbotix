export interface FAQItem {
  question: string
  answer: string
}

export interface FAQCategory {
  id: string
  name: string
  icon: string
  items: FAQItem[]
}

export const faqCategories: FAQCategory[] = [
  {
    id: 'courses',
    name: '课程相关',
    icon: '📚',
    items: [
      {
        question: "我的孩子适合参加这个课程吗？",
        answer: "我们的课程专为14-18岁的高中生设计，无需编程基础。只要对科技感兴趣，有好奇心和学习热情的学生都适合参加。我们会根据学生的水平调整教学节奏。"
      },
      {
        question: "需要编程基础吗？",
        answer: "不需要！我们的课程从零基础开始，使用图形化编程工具和简单的Python代码。我们会循序渐进地教授编程概念，确保每个学生都能跟上。"
      },
      {
        question: "具体学习什么内容？",
        answer: "课程涵盖AI基础概念（机器学习、计算机视觉、语音识别）、机器人控制、传感器使用、编程逻辑等。每个主题都通过动手项目来学习。"
      },
      {
        question: "有实践项目吗？",
        answer: "是的！我们强调实践性学习。学生会构建真实的机器人，编写AI程序，完成各种挑战项目。每个课程都有最终的项目展示。"
      },
      {
        question: "需要自备设备吗？",
        answer: "不需要！我们提供所有必要的设备，包括机器人套件、传感器、笔记本电脑等。学生只需要带上学习热情即可。"
      },
      {
        question: "使用什么编程语言？",
        answer: "我们使用Python作为主要编程语言，因为它简单易学且功能强大。对于初学者，我们也提供图形化编程工具如Blockly。"
      }
    ]
  },
  {
    id: 'booking',
    name: '预约支付',
    icon: '📅',
    items: [
      {
        question: "如何预约课程？",
        answer: "您可以通过我们的网站直接预约，选择课程、时间和地点。也可以致电或发送邮件联系我们进行预约。我们的客服团队会协助您完成整个流程。"
      },
      {
        question: "需要提前多久预约？",
        answer: "建议提前2-4周预约，以确保有合适的时段。对于学校团体预约，建议提前1-2个月联系，以便我们安排讲师和准备设备。"
      },
      {
        question: "支持哪些支付方式？",
        answer: "我们支持信用卡、借记卡、银行转账等多种支付方式。所有在线支付都通过安全的Stripe平台处理，确保您的信息安全。"
      },
      {
        question: "支付是否安全？",
        answer: "绝对安全！我们使用行业标准的SSL加密和PCI DSS合规的支付处理系统。您的支付信息不会被我们存储，直接由安全的支付网关处理。"
      },
      {
        question: "如何取消预约？",
        answer: "如需取消预约，请提前48小时联系我们。取消政策：提前48小时以上取消，全额退款；24-48小时内取消，退款50%；24小时内取消，不予退款。"
      },
      {
        question: "可以开具学校发票吗？",
        answer: "当然可以！我们为学校客户提供正式的税务发票，支持分批付款和年度结算。请提供学校的税务信息，我们会相应处理。"
      }
    ]
  },
  {
    id: 'school',
    name: '学校合作',
    icon: '🏫',
    items: [
      {
        question: "哪些学校可以合作？",
        answer: "我们与澳大利亚各地的K-12学校合作，包括公立学校、私立学校和特殊教育学校。只要学校有开展STEM教育的意愿，我们都欢迎合作。"
      },
      {
        question: "合作流程是什么？",
        answer: "合作流程：1) 初步咨询和需求评估 2) 定制课程方案 3) 试运行课程 4) 正式合作协议 5) 定期评估和优化。整个过程通常需要2-4周。"
      },
      {
        question: "可以定制课程内容吗？",
        answer: "是的！我们根据学校的课程安排、学生水平和教学目标定制课程内容。可以调整课程时长、难度、主题等，确保与学校课程完美融合。"
      },
      {
        question: "合作费用如何计算？",
        answer: "费用根据课程类型、学生数量、课程时长等因素计算。我们提供批量折扣，长期合作还有额外优惠。具体费用会在需求评估后提供详细报价。"
      },
      {
        question: "提供什么设备支持？",
        answer: "我们提供完整的设备支持，包括机器人套件、传感器、编程设备等。设备费用通常包含在课程费用中，学校无需额外购买设备。"
      },
      {
        question: "有教师培训吗？",
        answer: "是的！我们提供教师培训课程，帮助学校教师掌握AI和机器人教学技能。培训包括理论知识和实践操作，确保教师能够独立开展相关课程。"
      }
    ]
  },
  {
    id: 'technical',
    name: '技术设备',
    icon: '💻',
    items: [
      {
        question: "设备费用包含在课程中吗？",
        answer: "是的！所有必要的设备费用都包含在课程费用中，包括机器人套件、传感器、编程设备等。学生无需额外购买任何设备。"
      },
      {
        question: "需要安装什么软件？",
        answer: "我们会提供所有必要的软件，包括Python、Arduino IDE、图形化编程工具等。软件都是免费的开源工具，我们会在课程开始时指导学生安装。"
      },
      {
        question: "支持哪些操作系统？",
        answer: "我们的软件支持Windows、macOS和Linux系统。对于学校环境，我们特别优化了Windows系统的兼容性，确保在学校的电脑上也能正常运行。"
      },
      {
        question: "遇到技术问题怎么办？",
        answer: "我们提供多种技术支持渠道：1) 课程中的实时指导 2) 在线技术支持 3) 技术文档和视频教程 4) 社区讨论平台。我们承诺24小时内响应技术问题。"
      },
      {
        question: "有在线学习材料吗？",
        answer: "是的！我们提供丰富的在线学习资源，包括视频教程、编程指南、项目案例等。学生可以在课后继续学习和练习。"
      },
      {
        question: "可以下载课程资料吗？",
        answer: "当然可以！所有课程资料都可以下载，包括编程代码、项目文档、学习指南等。我们鼓励学生在课后继续学习和实践。"
      }
    ]
  },
  {
    id: 'results',
    name: '学习效果',
    icon: '🎯',
    items: [
      {
        question: "学完课程能掌握什么技能？",
        answer: "学生将掌握：1) AI基础概念和应用 2) 机器人编程和控制 3) 传感器使用和数据处理 4) 问题解决和逻辑思维 5) 团队协作和项目管理 6) 创新思维和创造力。"
      },
      {
        question: "有学习证书吗？",
        answer: "是的！完成课程的学生将获得Airbotix颁发的结业证书，证明其掌握了AI和机器人相关技能。证书在澳大利亚教育界得到广泛认可。"
      },
      {
        question: "如何评估学习效果？",
        answer: "我们采用多元化的评估方式：1) 项目作品评估 2) 技能测试 3) 团队协作表现 4) 创新思维展示 5) 自我反思报告。评估结果会及时反馈给学生和家长。"
      },
      {
        question: "学到的技能有什么用？",
        answer: "这些技能对学生的未来发展非常重要：1) 为大学STEM专业学习打下基础 2) 提升就业竞争力 3) 培养21世纪核心技能 4) 激发创新和创业精神 5) 适应未来工作环境。"
      },
      {
        question: "有进阶课程吗？",
        answer: "是的！我们提供多个层次的课程：入门课程 → 进阶课程 → 专业课程 → 竞赛培训。学生可以根据兴趣和水平选择适合的进阶路径。"
      },
      {
        question: "可以参加竞赛吗？",
        answer: "当然可以！我们组织学生参加各种AI和机器人竞赛，包括FIRST Robotics、VEX Robotics等国际赛事。我们提供专门的竞赛培训课程。"
      }
    ]
  }
]

// 获取所有FAQ数据
export const getAllFAQData = () => {
  return faqCategories.flatMap(category => 
    category.items.map(item => ({
      ...item,
      category: category.id
    }))
  )
}

// 根据分类获取FAQ数据
export const getFAQByCategory = (categoryId: string) => {
  const category = faqCategories.find(cat => cat.id === categoryId)
  return category ? category.items : []
}

// 搜索FAQ
export const searchFAQ = (searchTerm: string) => {
  const allData = getAllFAQData()
  return allData.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )
}
