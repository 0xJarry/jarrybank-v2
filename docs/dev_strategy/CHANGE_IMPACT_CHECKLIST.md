# Change Impact Analysis Checklist

> Use this checklist BEFORE and AFTER implementing any feature or change

## 🔍 Pre-Implementation Analysis

### 1. Scope Discovery
```bash
# Find all files importing the module you're changing
grep -r "from.*[ModuleName]" src/ --include="*.ts" --include="*.tsx"

# Find all references to a component
grep -r "[ComponentName]" src/ --include="*.ts" --include="*.tsx"

# Check for interface/type usage
grep -r "interface.*[InterfaceName]" src/ --include="*.ts"
grep -r ": [TypeName]" src/ --include="*.ts" --include="*.tsx"
```

- [ ] Listed all files that import the module
- [ ] Identified all components using this feature
- [ ] Found all TypeScript interfaces affected
- [ ] Checked for test files that need updates

### 2. Dependency Analysis
- [ ] Reviewed package.json for library compatibility
- [ ] Checked if new dependencies are needed
- [ ] Verified existing dependency versions
- [ ] Ensured no conflicting dependencies

### 3. State Management Impact
- [ ] Checked portfolioStore for related state
- [ ] Checked themeStore for UI impacts  
- [ ] Reviewed Wagmi hooks usage
- [ ] Identified localStorage/sessionStorage usage

### 4. Theme System Compatibility
- [ ] Verified component uses CSS variables
- [ ] Checked for hardcoded colors
- [ ] Ensured dark/light mode support
- [ ] Tested with all theme variants

### 5. Web3 Integration Check
- [ ] Verified wallet connection handling
- [ ] Checked network switch behavior
- [ ] Reviewed chain-specific logic
- [ ] Tested disconnection scenarios

## 🚧 During Implementation

### Code Quality Checks
- [ ] Following existing code patterns
- [ ] Using proper TypeScript types
- [ ] Adding JSDoc comments for complex logic
- [ ] Implementing error boundaries where needed

### Progressive Testing
- [ ] Testing with wallet connected
- [ ] Testing with wallet disconnected  
- [ ] Testing theme switches during feature use
- [ ] Testing with mock data
- [ ] Testing with real data

## ✅ Post-Implementation Verification

### 1. Immediate Validation
```bash
# Run linting
npm run lint

# Run type checking  
npm run typecheck

# Build check
npm run build

# Run dev server and manually test
npm run dev
```

- [ ] All lint rules pass
- [ ] No TypeScript errors
- [ ] Build completes successfully
- [ ] Manual testing shows feature works

### 2. Cross-Feature Testing
- [ ] Test feature with wallet connected/disconnected
- [ ] Switch themes while using feature
- [ ] Change networks during feature use
- [ ] Test with empty/null data states
- [ ] Test with error states

### 3. Performance Impact
- [ ] Check browser console for errors
- [ ] Monitor network requests (no infinite loops)
- [ ] Verify caching works as expected
- [ ] Check for memory leaks (React DevTools)

### 4. Update Tracking
- [ ] Updated FEATURE_IMPACT_MATRIX.md
- [ ] Added entry to CLAUDE.md CURRENT_CONTEXT
- [ ] Created/updated relevant tests
- [ ] Added TODO comments for deferred work

## 🔄 Component-Specific Checklists

### When Modifying Wallet Features
- [ ] Test on multiple wallet providers (MetaMask, Rainbow, etc.)
- [ ] Verify correct chain handling
- [ ] Check balance updates
- [ ] Test transaction signing
- [ ] Verify disconnection cleanup

### When Modifying Price Features
- [ ] Check cache invalidation
- [ ] Verify API rate limiting
- [ ] Test with missing price data
- [ ] Ensure USD calculations are correct
- [ ] Test refresh mechanisms

### When Modifying UI Components
- [ ] Test all theme variants
- [ ] Check responsive design
- [ ] Verify accessibility (keyboard nav, ARIA)
- [ ] Test loading states
- [ ] Test error states
- [ ] Check animations/transitions

### When Modifying State Management
- [ ] Check for race conditions
- [ ] Verify state persistence
- [ ] Test state reset on logout
- [ ] Check for unnecessary re-renders
- [ ] Verify computed values update

## 🚨 Red Flags - Stop If You See These

1. **Circular Dependencies**
   ```
   Module A imports B, B imports A
   ```
   **Action**: Refactor to break the cycle

2. **Type Errors Cascading**
   ```
   One change causes 10+ type errors
   ```
   **Action**: Re-evaluate the change approach

3. **Performance Degradation**
   - Infinite re-renders
   - Excessive API calls
   - Memory constantly increasing
   **Action**: Add proper deps arrays, memoization

4. **Theme Breaking**
   - Colors not updating
   - Layout breaking on theme switch
   **Action**: Check CSS variable usage

5. **Wallet State Corruption**
   - Incorrect addresses showing
   - Balances not updating
   **Action**: Check wallet event handlers

## 📝 Documentation Requirements

### For New Features
- [ ] Added to FEATURE_IMPACT_MATRIX.md
- [ ] Documented in CLAUDE.md if architectural
- [ ] Added usage example in comments
- [ ] Updated relevant README sections

### For Bug Fixes
- [ ] Documented what was broken
- [ ] Explained the fix approach
- [ ] Added test to prevent regression
- [ ] Updated any affected documentation

### For Refactoring
- [ ] Documented why refactoring was needed
- [ ] Listed all files changed
- [ ] Verified no behavior changes
- [ ] Updated architectural docs if needed

## 🧪 Testing Checklist

### Unit Testing
- [ ] Component renders without errors
- [ ] Props are handled correctly
- [ ] State changes work as expected
- [ ] Error cases are handled

### Integration Testing  
- [ ] Feature works with real wallet
- [ ] API integrations work correctly
- [ ] State management integrations work
- [ ] Multi-component workflows succeed

### E2E Testing Scenarios
- [ ] Complete user flow works
- [ ] Edge cases are handled
- [ ] Performance is acceptable
- [ ] No console errors

## 🔧 Quick Validation Commands

```bash
# Full validation suite
npm run lint && npm run typecheck && npm run build

# Find TODO/FIXME comments
grep -r "TODO\|FIXME\|XXX\|HACK" src/

# Check for console.logs (remove before commit)
grep -r "console.log" src/

# Find unused imports
npm run lint -- --rule "no-unused-vars"

# Check bundle size impact
npm run build && ls -lh .next/static/chunks
```

## 📊 Impact Severity Levels

### 🟢 Low Impact
- Changes to single component
- No state management changes
- No API changes
- Style-only updates

### 🟡 Medium Impact  
- Changes affect 2-5 components
- Minor state management updates
- New API endpoint added
- New dependency added

### 🔴 High Impact
- Changes affect 6+ components
- Major state management refactor
- Breaking API changes
- Core architecture changes
- Web3 integration changes

## 🎯 Success Criteria

A change is considered successful when:
1. ✅ All checklist items relevant to the change are completed
2. ✅ No regression in existing features
3. ✅ Performance metrics maintained or improved
4. ✅ Documentation is updated
5. ✅ Code follows project patterns
6. ✅ Manual testing confirms expected behavior

---

**Remember**: This checklist is your safety net. Use it to catch issues early and maintain code quality. Skip steps at your own risk!