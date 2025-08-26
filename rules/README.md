# Airbotix Development Rules

This directory contains all the coding standards, principles, and rules for the Airbotix project. These rules are designed to ensure consistent, maintainable, and high-quality code across the entire project.

## 📋 Rule Categories

### 🏗️ [Coding Principles](./coding-principles.md)
Core programming principles that guide all development decisions:
- **SOLID Principles** (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion)
- **KISS** (Keep It Simple, Stupid)
- **DRY** (Don't Repeat Yourself)
- Component design patterns
- Code organization strategies

### 📁 [File Organization](./file-organization.md)
Rules for maintaining manageable file sizes and structure:
- **1000-line maximum** per file (hard limit)
- File breakdown strategies
- Directory structure guidelines
- Component splitting techniques
- Monitoring and enforcement

### 🔤 [TypeScript Standards](./typescript-standards.md)
TypeScript coding standards and interface requirements:
- **Mandatory interfaces** for all data structures
- Interface vs type usage guidelines
- Naming conventions
- Generic patterns
- Type safety enforcement

### 📝 [String Constants](./string-constants.md)
Mandatory string constant usage rules:
- **No magic strings** allowed
- Constant organization strategies
- String categorization (UI, API, business logic)
- Type-safe constants
- Refactoring guidelines

## 🎯 Quick Reference

### Critical Rules Summary
1. **File Size**: Maximum 1000 lines per file
2. **String Constants**: All strings must be named constants
3. **TypeScript Interfaces**: Required for all data structures
4. **SOLID Principles**: Follow single responsibility and dependency inversion
5. **No Code Duplication**: Extract common functionality

### Before You Code Checklist
- [ ] Will this file exceed 1000 lines?
- [ ] Are all strings defined as constants?
- [ ] Do all components have proper TypeScript interfaces?
- [ ] Does this follow single responsibility principle?
- [ ] Am I duplicating existing functionality?

## 🚦 Enforcement

### Automated Checks
```bash
# Check file sizes
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1 > 1000'

# Run TypeScript strict checks
npx tsc --noEmit --strict

# Lint code quality
npm run lint
```

### Code Review Requirements
Every pull request must verify compliance with:
- File size limits
- Interface completeness  
- String constant usage
- SOLID principle adherence
- Code duplication elimination

## 📚 Usage Guidelines

### For New Developers
1. Read all rule documents in order
2. Review example patterns in each document
3. Set up automated checks in your IDE
4. Ask questions during code review

### For Code Reviews
1. Use the enforcement checklists in each rule document
2. Reference specific rule sections when providing feedback
3. Ensure examples match documented patterns
4. Verify automated checks are passing

### For Refactoring
1. Follow the step-by-step guides in each document
2. Prioritize rule violations by impact
3. Test thoroughly after each change
4. Update documentation as needed

## 🔄 Rule Updates

### When to Update Rules
- New patterns emerge in the codebase
- Tool capabilities change (TypeScript, ESLint, etc.)
- Team feedback identifies gaps or issues
- Performance or maintenance issues arise

### Update Process
1. Propose changes in team discussion
2. Update relevant rule document
3. Update enforcement tools/scripts
4. Communicate changes to all developers
5. Update existing code gradually

## 🤝 Contributing to Rules

### Suggesting Improvements
- Identify specific problems with current rules
- Propose concrete solutions with examples
- Consider impact on existing codebase
- Discuss with team before implementation

### Adding New Rules
- Must solve actual problems we're experiencing
- Should be enforceable (automatically or in code review)
- Include clear examples of good vs bad patterns
- Provide migration path for existing code

## 📞 Support

### Getting Help
- **Questions about rules**: Ask in team chat or during standup
- **Enforcement issues**: Check with tech lead or senior developer
- **Tool problems**: Refer to individual rule documents
- **Rule conflicts**: Escalate to team discussion

### Reporting Issues
- Document specific cases where rules are unclear
- Provide examples of problematic code
- Suggest potential solutions
- Create GitHub issues for tracking

---

## 🎉 Remember

> "Rules are meant to create consistency and quality, not to slow down development. When rules help us write better code faster, they're working correctly."

**The goal is maintainable, readable, and robust code that serves our educational mission at Airbotix.**

---

*Last Updated: 2025-01-26*  
*Next Review: 2025-04-26*