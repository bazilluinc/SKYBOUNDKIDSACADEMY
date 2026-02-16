#!/bin/bash
echo "Initializing Git..."
git init

echo "Adding files..."
git add .

echo "Committing..."
git commit -m "Update Skybound Academy Code"

echo "Setting branch to main..."
git branch -M main

echo "Configuring remote..."
git remote add origin https://github.com/bazilluinc/skyboundkidsacademy.git
git remote set-url origin https://github.com/bazilluinc/skyboundkidsacademy.git

echo "Pushing to GitHub..."
git push -u origin main

echo "Done!"
