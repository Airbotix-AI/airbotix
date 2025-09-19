import { forwardRef, createContext, useContext } from 'react'
import { cn } from '@/utils'
import type { 
  FieldError, 
  FieldPath, 
  FieldValues, 
  UseFormReturn 
} from 'react-hook-form'

// ============================================================================
// FORM CONTEXT
// ============================================================================

interface FormFieldContextValue {
  name: string
}

interface FormItemContextValue {
  id: string
}

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue)
const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue)

// ============================================================================
// FORM COMPONENTS
// ============================================================================

const Form = <T extends FieldValues>({ 
  children, 
  className,
  ...formProps 
}: { children: React.ReactNode; className?: string } & UseFormReturn<T>) => {
  // Extract only DOM-appropriate props and ignore React Hook Form methods
  const {
    // React Hook Form methods that should NOT be passed to DOM
    handleSubmit,
    watch,
    getValues,
    getFieldState,
    setError,
    clearErrors,
    setValue,
    trigger,
    formState,
    reset,
    resetField,
    setFocus,
    unregister,
    control,
    register,
    subscribe,
    ...domProps
  } = formProps as any

  return <div className={className} {...domProps}>{children}</div>
}

interface FormFieldProps<T extends FieldValues = FieldValues> {
  name: FieldPath<T>
  children: React.ReactNode
}

const FormField = <T extends FieldValues = FieldValues>({ 
  name, 
  children 
}: FormFieldProps<T>) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {children}
    </FormFieldContext.Provider>
  )
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem = forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => {
    const id = `form-item-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = 'FormItem'

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => {
    const { id } = useContext(FormItemContext)
    
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className
        )}
        htmlFor={id}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )
  }
)
FormLabel.displayName = 'FormLabel'

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormControl = forwardRef<HTMLDivElement, FormControlProps>(
  ({ ...props }, ref) => {
    const { id } = useContext(FormItemContext)
    
    return (
      <div
        ref={ref}
        id={id}
        aria-describedby={`${id}-description`}
        aria-invalid="false"
        {...props}
      />
    )
  }
)
FormControl.displayName = 'FormControl'

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => {
    const { id } = useContext(FormItemContext)
    
    return (
      <p
        ref={ref}
        id={`${id}-description`}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    )
  }
)
FormDescription.displayName = 'FormDescription'

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: FieldError
}

const FormMessage = forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, error, ...props }, ref) => {
    const { id } = useContext(FormItemContext)
    const body = error?.message || children
    
    if (!body) {
      return null
    }
    
    return (
      <p
        ref={ref}
        id={`${id}-message`}
        className={cn('text-sm font-medium text-destructive', className)}
        {...props}
      >
        {body}
      </p>
    )
  }
)
FormMessage.displayName = 'FormMessage'

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
