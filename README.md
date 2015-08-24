# ld33
YEAH YEAH YEAH LETS GET THIS STARTED!


# phaser patch for smooth camera following with offset 

```
--- phaser.js	2014-03-28 01:42:49.000000000 +0000
+++ phaser.patched.js	2015-08-23 10:46:38.141772416 +0000
@@ -12757,10 +12757,11 @@
     * @param {Phaser.Sprite|Phaser.Image|Phaser.Text} target - The object you want the camera to track. Set to null to not follow anything.
     * @param {number} [style] - Leverage one of the existing "deadzone" presets. If you use a custom deadzone, ignore this parameter and manually specify the deadzone after calling follow().
     */
-    follow: function (target, style) {
+    follow: function (target, style, span) {
 
         if (typeof style === "undefined") { style = Phaser.Camera.FOLLOW_LOCKON; }
-
+        if (typeof span === "undefined") { span = {x:0,y:0} }
+        this.span = span;
         this.target = target;
 
         var helper;
@@ -12877,7 +12878,7 @@
         }
         else
         {
-            this.focusOnXY(this.target.x, this.target.y);
+            this.focusOnXY(this.target.x+this.span.x, this.target.y+this.span.y);
         }
 
     },
```



## attribution

cave_6.png by chipmonk (http://opengameart.org/users/chipmunk http://opengameart.org/content/cave-tiles-sprites)