# Implementation Review: [FEATURE_NAME]

> Date: [YYYY-MM-DD]  
> Story/Task: [Reference Number]  
> Developer: Claude + [Your Name]  
> Review Status: [🚧 In Progress | ✅ Complete | ⚠️ Needs Revision]

## 📋 Executive Summary

**What was built**: [1-2 sentence description]  
**Success Level**: [0-100%]  
**Time Taken**: [Actual vs Estimated]  
**Blockers Encountered**: [Yes/No - brief description]

## 🎯 Original Requirements vs Implementation

| Requirement | Planned Approach | Actual Implementation | Status | Deviation Reason |
|-------------|------------------|----------------------|---------|------------------|
| [Feature 1] | [Original plan] | [What was built] | ✅/⚠️/❌ | [Why different] |
| [Feature 2] | [Original plan] | [What was built] | ✅/⚠️/❌ | [Why different] |

## 📁 Files Modified

### New Files Created
```
src/components/NewComponent.tsx - [Purpose]
src/hooks/useNewHook.ts - [Purpose]
src/lib/newUtility.ts - [Purpose]
```

### Existing Files Modified
```
src/app/page.tsx - [What changed and why]
src/store/store.ts - [What changed and why]
src/components/ExistingComponent.tsx - [What changed and why]
```

### Files That Should Be Updated (But Weren't)
```
src/components/RelatedComponent.tsx - [Why it needs update]
tests/feature.test.ts - [Missing test coverage]
```

## 🔄 Ripple Effects Discovered

### Expected Dependencies
- ✅ Wallet connection required for feature
- ✅ Price data integration needed
- ✅ Theme system compatibility

### Unexpected Dependencies Found
- ⚠️ Had to modify X because of Y constraint
- ⚠️ Discovered Z component also needed updates
- ⚠️ Performance impact on unrelated feature

### Technical Debt Created
- [ ] Component X needs refactoring after this change
- [ ] Missing TypeScript types for Y
- [ ] Hardcoded values that should be configurable
- [ ] Missing error handling in Z scenario

## 🧪 Testing Status

### What Was Tested
- ✅ Basic functionality with wallet connected
- ✅ Theme switching during feature use
- ✅ Error states handling

### What Wasn't Tested  
- ❌ Multi-wallet scenarios
- ❌ Network switching during operation
- ❌ Performance with large datasets
- ❌ Edge cases: [List them]

### Known Issues
1. **Issue**: [Description]
   - **Severity**: [High/Medium/Low]
   - **Workaround**: [If any]
   - **Fix ETA**: [Immediate/Next Sprint/Backlog]

## 📊 Performance Impact

| Metric | Before | After | Change | Acceptable? |
|--------|--------|-------|---------|-------------|
| Bundle Size | X KB | Y KB | +Z KB | ✅/⚠️/❌ |
| Load Time | X ms | Y ms | +Z ms | ✅/⚠️/❌ |
| Re-renders | X | Y | +Z | ✅/⚠️/❌ |
| API Calls | X/min | Y/min | +Z | ✅/⚠️/❌ |

## 🏗️ Architecture Decisions

### Design Patterns Used
- **Pattern**: [e.g., Container/Presenter]
  - **Rationale**: [Why this pattern]
  - **Alternative Considered**: [What else was considered]

### State Management Approach
- **Chosen**: [e.g., Zustand store vs local state]
- **Rationale**: [Why this approach]
- **Trade-offs**: [What we gave up]

### API Integration Strategy
- **Approach**: [e.g., Direct calls vs service layer]
- **Caching**: [Strategy used]
- **Error Handling**: [Approach taken]

## 📝 Documentation Updates

### Updated
- ✅ FEATURE_IMPACT_MATRIX.md
- ✅ CLAUDE.md CURRENT_CONTEXT
- ✅ Component JSDoc comments

### Needs Updating
- ❌ PRD.md - [Section needing update]
- ❌ Technical spec - [What changed]
- ❌ API documentation - [New endpoints]
- ❌ README.md - [Usage examples]

## 🚀 Deployment Considerations

### Environment Variables
```env
NEW_ENV_VAR=value  # Purpose
```

### Migration Steps
1. [Step if any data migration needed]
2. [Configuration changes required]

### Rollback Plan
- [How to rollback if issues found]
- [What data needs to be preserved]

## 📈 Metrics & Monitoring

### Success Metrics
- [ ] [Metric 1]: Target vs Actual
- [ ] [Metric 2]: Target vs Actual

### Monitoring Needed
- [ ] Error rate for [specific operation]
- [ ] Performance of [specific feature]
- [ ] User adoption of [feature]

## 🎓 Lessons Learned

### What Went Well
- ✅ [Positive aspect 1]
- ✅ [Positive aspect 2]

### What Could Be Improved
- 💡 [Improvement 1]
- 💡 [Improvement 2]

### Surprises
- 😮 [Unexpected discovery 1]
- 😮 [Unexpected complexity in X]

## ⏭️ Next Steps

### Immediate (Before marking complete)
- [ ] Fix critical issue X
- [ ] Update documentation Y
- [ ] Add basic test for Z

### Short Term (Next session/sprint)
- [ ] Improve error handling
- [ ] Add comprehensive tests
- [ ] Optimize performance

### Long Term (Backlog)
- [ ] Refactor for better maintainability
- [ ] Add advanced features
- [ ] Consider architectural improvements

## 🔍 Code Review Checklist

- [ ] Code follows project conventions
- [ ] TypeScript types are properly defined
- [ ] No console.logs left in code
- [ ] Error handling is comprehensive
- [ ] Components are properly memoized
- [ ] No hardcoded values that should be config
- [ ] Comments explain complex logic
- [ ] File organization makes sense
- [ ] No circular dependencies introduced
- [ ] Security considerations addressed

## 📸 Screenshots/Evidence

[Include screenshots of the feature working, or error states if relevant]

## 🏁 Final Status

**Ready for Production?**: [Yes/No]  
**If No, blockers**: [List critical issues]  
**Recommended Actions**: [What should happen next]

---

### Review Sign-off

- [ ] Technical implementation reviewed
- [ ] Documentation updated
- [ ] Tests adequate for feature
- [ ] Performance acceptable
- [ ] Security considerations addressed
- [ ] Ready for next phase

**Notes for Next Developer/Session**:
[Any special instructions or context needed for whoever picks this up next]