# Yoga POS Design System

A comprehensive design system for the Yoga POS mobile application, featuring a consistent color palette, typography, spacing, and reusable components.

## Table of Contents

- [Getting Started](#getting-started)
- [Theme Configuration](#theme-configuration)
- [Colors](#colors)
- [Typography](#typography)
- [Components](#components)
- [Layout Components](#layout-components)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Examples](#examples)

## Getting Started

The design system is already integrated into the application. All components automatically adapt to the current theme (light or dark mode).

### Using the Theme

```tsx
import {useTheme} from '@hooks/useTheme';

const MyComponent = () => {
  const {theme, isDark, toggleTheme} = useTheme();

  return (
    <View style={{backgroundColor: theme.colors.background.primary}}>
      {/* Your content */}
    </View>
  );
};
```

## Theme Configuration

### Theme Structure

The theme includes:
- **Colors**: Complete color palette with light and dark mode support
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale (xs to 3xl)
- **Border Radius**: Predefined radius values
- **Shadows**: Platform-specific shadow configurations
- **Layout**: Container, screen, and card padding
- **Button**: Size configurations
- **Input**: Height and padding settings
- **Animation**: Duration and easing configurations
- **Icon Sizes**: Standard icon size scale
- **Z-Index**: Layering for modals, dropdowns, etc.

### Accessing Theme Values

```tsx
import {useTheme} from '@hooks/useTheme';

const {theme} = useTheme();

// Colors
theme.colors.primary[500]
theme.colors.text.primary
theme.colors.background.card

// Spacing
theme.spacing.md // 16
theme.spacing.lg // 24

// Typography
theme.typography.fontSize.base // 16
theme.typography.fontFamily.bold

// Shadows
theme.shadows.md

// Border Radius
theme.borderRadius.base // 8
```

## Colors

### Color Palette

#### Primary (Sky Blue)
- `primary[50-950]`: Complete shade range
- Main brand color: `primary[500]` (#0ea5e9)

#### Secondary (Purple)
- `secondary[50-950]`: Complete shade range
- Accent color: `secondary[500]` (#a855f7)

#### Semantic Colors
- **Success**: Green tones for positive actions
- **Warning**: Orange tones for caution
- **Error**: Red tones for errors/destructive actions
- **Info**: Blue tones for information

#### Background Colors
- `background.primary`: Main background
- `background.secondary`: Secondary background
- `background.tertiary`: Tertiary background
- `background.card`: Card backgrounds

#### Text Colors
- `text.primary`: Primary text
- `text.secondary`: Secondary text
- `text.tertiary`: Tertiary/muted text
- `text.inverse`: Inverse text (for dark backgrounds)
- `text.link`: Link text

#### Border Colors
- `border.light`: Light borders
- `border.medium`: Medium borders
- `border.dark`: Dark borders

### Dark Mode

The design system automatically switches between light and dark color schemes:

```tsx
const {toggleTheme, isDark} = useTheme();

// Toggle theme
<Button onPress={toggleTheme}>
  {isDark ? 'Light Mode' : 'Dark Mode'}
</Button>
```

## Typography

### Typography Component

```tsx
import {Typography} from '@components/ui';

<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="body">Body text</Typography>
<Typography variant="caption">Caption text</Typography>
```

### Available Variants

- `h1` - Largest heading (36px, bold)
- `h2` - Second heading (30px, bold)
- `h3` - Third heading (24px, semibold)
- `h4` - Fourth heading (20px, semibold)
- `h5` - Fifth heading (18px, medium)
- `h6` - Sixth heading (16px, medium)
- `body` - Body text (16px, regular)
- `bodyLarge` - Large body (18px, regular)
- `bodySmall` - Small body (14px, regular)
- `caption` - Caption text (12px, regular)
- `label` - Label text (14px, medium)
- `button` - Button text (16px, semibold)

### Font Weights

```tsx
<Typography variant="body" weight="bold">
  Bold text
</Typography>
```

Available weights: `regular`, `medium`, `semiBold`, `bold`

### Custom Colors and Alignment

```tsx
<Typography
  variant="body"
  color={theme.colors.primary[500]}
  align="center"
>
  Centered colored text
</Typography>
```

## Components

### Button

```tsx
import {Button} from '@components/ui';

<Button
  variant="primary"
  size="lg"
  onPress={handlePress}
  fullWidth
>
  Click Me
</Button>
```

**Variants:**
- `primary` - Primary action button (blue)
- `secondary` - Secondary action button (purple)
- `outline` - Outlined button
- `ghost` - Text-only button
- `danger` - Destructive action button (red)

**Sizes:** `sm`, `md`, `lg`, `xl`

**Props:**
- `loading` - Show loading spinner
- `disabled` - Disable button
- `leftIcon` - Icon on the left
- `rightIcon` - Icon on the right
- `fullWidth` - Take full width

### Input

```tsx
import {Input} from '@components/ui';

<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  required
/>
```

**Props:**
- `label` - Input label
- `error` - Error message
- `helperText` - Helper text
- `leftIcon` - Icon on the left
- `rightIcon` - Icon on the right
- `required` - Show required asterisk
- `disabled` - Disable input
- `secureTextEntry` - Password input (with toggle)

### Card

```tsx
import {Card} from '@components/ui';

<Card
  variant="elevated"
  padding="md"
  title="Card Title"
  subtitle="Card subtitle"
>
  Card content
</Card>
```

**Variants:**
- `elevated` - Card with shadow
- `outlined` - Card with border
- `filled` - Card with filled background

**Padding:** `none`, `sm`, `md`, `lg`

**Props:**
- `title` - Card title
- `subtitle` - Card subtitle
- `header` - Custom header component
- `footer` - Custom footer component
- `onPress` - Make card touchable

## Layout Components

### Container

```tsx
import {Container} from '@components/layout';

<Container padding fullWidth>
  {children}
</Container>
```

**Props:**
- `padding` - Add horizontal padding
- `fullWidth` - Take full width (no max-width)
- `centered` - Center content

### Row

```tsx
import {Row} from '@components/layout';

<Row
  gap="md"
  justifyContent="space-between"
  alignItems="center"
>
  {children}
</Row>
```

**Props:**
- `gap` - Space between children (xs to 3xl)
- `justifyContent` - Flex justify-content
- `alignItems` - Flex align-items
- `wrap` - Allow wrapping

### Column

```tsx
import {Column} from '@components/layout';

<Column gap="md" alignItems="center">
  {children}
</Column>
```

**Props:**
- `gap` - Space between children (xs to 3xl)
- `justifyContent` - Flex justify-content
- `alignItems` - Flex align-items

### Spacer

```tsx
import {Spacer} from '@components/layout';

<Spacer size="md" />
<Spacer direction="horizontal" size="lg" />
<Spacer customSize={20} />
```

**Props:**
- `size` - Predefined size (xs to 3xl)
- `direction` - `vertical` (default) or `horizontal`
- `customSize` - Custom pixel value

## Hooks

### useTheme

Access the current theme and theme controls:

```tsx
import {useTheme} from '@hooks/useTheme';

const {theme, themeMode, isDark, setThemeMode, toggleTheme} = useTheme();
```

**Returns:**
- `theme` - Current theme object
- `themeMode` - Current mode ('light' or 'dark')
- `isDark` - Boolean for dark mode
- `setThemeMode` - Set theme mode explicitly
- `toggleTheme` - Toggle between light and dark

### useResponsive

Get responsive information about the device:

```tsx
import {useResponsive} from '@hooks/useResponsive';

const {
  width,
  height,
  deviceType,
  orientation,
  isPhone,
  isTablet,
  isDesktop,
  isPortrait,
  isLandscape
} = useResponsive();
```

## Utilities

### Style Helpers

```tsx
import {
  conditionalStyle,
  mergeStyles,
  hexToRgba,
  createSpacing,
  createMargin,
  getResponsivePadding,
  getResponsiveFontSize
} from '@utils/styleHelpers';

// Conditional styling
const style = conditionalStyle(
  isActive,
  {backgroundColor: 'blue'},
  {backgroundColor: 'gray'}
);

// Apply opacity to color
const color = hexToRgba('#0ea5e9', 0.5);

// Create spacing
const spacing = createSpacing(16, 24); // top, right, bottom, left
```

## Examples

### Complete Form Example

```tsx
import React, {useState} from 'react';
import {View} from 'react-native';
import {useTheme} from '@hooks/useTheme';
import {Typography, Button, Input} from '@components/ui';
import {Column, Spacer} from '@components/layout';

const MyForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {theme} = useTheme();

  return (
    <View style={{padding: theme.spacing.lg}}>
      <Typography variant="h3" color={theme.colors.text.primary}>
        Login
      </Typography>
      <Spacer size="lg" />

      <Column gap="md">
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          required
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          required
        />

        <Button variant="primary" size="lg" fullWidth>
          Sign In
        </Button>
      </Column>
    </View>
  );
};
```

### Dashboard Card Example

```tsx
import {Card} from '@components/ui';
import {Row, Spacer} from '@components/layout';

const DashboardCard = () => {
  const {theme} = useTheme();

  return (
    <Row gap="md" wrap>
      <Card variant="elevated" padding="md" style={{flex: 1, minWidth: '45%'}}>
        <Typography variant="h3" color={theme.colors.primary[500]}>
          $12,500
        </Typography>
        <Spacer size="xs" />
        <Typography variant="bodySmall" color={theme.colors.text.secondary}>
          Today's Sales
        </Typography>
      </Card>
    </Row>
  );
};
```

## Best Practices

1. **Always use theme colors** instead of hardcoded values
2. **Use spacing from theme** for consistent margins and padding
3. **Prefer design system components** over custom styled components
4. **Use Typography component** instead of Text for consistent styling
5. **Use layout components** (Row, Column, Spacer) for consistent spacing
6. **Test in both light and dark modes** to ensure proper contrast
7. **Use semantic color names** (success, error, warning) for better maintainability

## Support

For questions or issues with the design system, please refer to the component source code in:
- `/src/components/ui/` - UI components
- `/src/components/layout/` - Layout components
- `/src/constants/theme.ts` - Theme configuration
- `/src/constants/colors.ts` - Color definitions
