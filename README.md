# Friflex Flutter Utils 

A plugin for Flutter developers at Friflex, an IT company, designed for VSCode.

## Features

### 1. Create features folders
- Creates feature folders for Flutter projects following a predefined structure based on **Clean Architecture** principles.  
- Automatically generates:
  - Repository files (main and mock) in `data/repository`.
  - DTO files in `data/dto`.
  - Interface files in `domain/repository`.
  - Screen classes in `presentation/screens`.

After executing the command, the `.friflex_config` folder will be created in your project.This folder will contain the\template. You can change it for your own purposes.

#### Folder Structure Example
```plaintext
feature_name/
├── data/
│   ├── repository/
│   │   ├── feature_name_repository.dart
│   │   └── feature_name_repository_mock.dart
├── domain/
│   ├── state/
│   ├── entity/
│   └── repository/
│       └── i_feature_name_repository.dart
└── presentation/
    ├── components/
    └── screens/
```

This plugin simplifies the process of scaffolding feature modules for Flutter developers using **VSCode**.

### 2. Create the Entity, StatelessWidget, and StatefulWidget classes according to your file name.
Context menu, if the current file editor is `.dart`.
```plaintext
Friflex/
  ├── Create Entity
  ├── Create StatelessWidget
  └── Create StatefulWidget
```
### 3. Add documentation comments to Dart classes
- Adds documentation comments to Dart classes using the `{@template}` tag.
- Supports adding comments to constructors with the `{@macro}` tag.
```plaintext
Friflex/
  ├── Add Comments
```

### 4. Use keyboard shortcuts
- `Ctrl + Shift + 1` to create an Entity class. 
- `Ctrl + Shift + 2` to create a StatelessWidget class.
- `Ctrl + Shift + 3` to create a StatefulWidget class.
- `Ctrl + Shift + 4` to add comments to a Dart class.

## Settings
### You can change it in the plugin settings:

1. Whether to add the prefix "I" to the repository interface, by default TRUE.
2. Use the equatable   library when creating an Entity, by default TRUE.