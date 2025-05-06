import * as assert from 'assert';
import * as vscode from 'vscode';
import { isConstructor, findConstructors } from '../commands/add_comments/add_comments_utils';

suite('Add Comments Utils Test Suite', () => {
    test('isConstructor detects class constructor correctly', () => {
        // Standard constructor
        assert.strictEqual(isConstructor('MyClass()', 'MyClass'), true);
        assert.strictEqual(isConstructor('  MyClass() {', 'MyClass'), true);
        
        // Constructor with parameters
        assert.strictEqual(isConstructor('MyClass(String name, int age) {', 'MyClass'), true);
        
        // Named constructor
        assert.strictEqual(isConstructor('MyClass.named()', 'MyClass'), true);
        
        // Factory constructor
        assert.strictEqual(isConstructor('factory MyClass() {', 'MyClass'), true);
        
        // Const constructor
        assert.strictEqual(isConstructor('const MyClass(this.value);', 'MyClass'), true);
        
        // Not constructors
        assert.strictEqual(isConstructor('class MyClass {', 'MyClass'), false);
        assert.strictEqual(isConstructor('var myClass = MyClass();', 'MyClass'), false);
    });
    
    test('findConstructors adds comments where needed', () => {
        // Create test document with class and constructor
        const text = `class TestClass {
  // Empty line without comment
  TestClass() {}
  
  /// Comment already exists
  TestClass.withComment() {}
}`;
        
        const mockDocument = {
            getText: () => text,
            lineAt: (line: number) => ({
                text: text.split('\n')[line],
                lineNumber: line
            }),
            positionAt: () => new vscode.Position(0, 0),
            uri: vscode.Uri.file('test.dart')
        } as unknown as vscode.TextDocument;
        
        const edits: vscode.TextEdit[] = [];
        
        findConstructors(text, 'TestClass', mockDocument, edits);
        
        // There should be only one new comment for the first constructor
        assert.strictEqual(edits.length, 1);
        assert.strictEqual(edits[0].newText.includes('/// {@macro TestClass}'), true);
    });
});