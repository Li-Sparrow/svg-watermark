## 使用

### 参数
| 参数      | 解释   | 默认值 | 是否必须  | 举例      |
| selector      | 容器   | 默认body | 否  |   '#id'    |
| value      | 水印文字   | 无；多水印用\n分隔 | 是  | 水印测试      |
| fillstyle  | 水印填充样式 | #000000   | 否  | 'rgba(192, 192, 192, 0.6)' |
| font       | 水印字体   | 无          | 否  | "bold 20px Serif"          |
| zIndex     | 水印层级   | 99999      | 否  |                            |
| rotate     | 水印的旋转度 | -45       | 否  | -45                       |
| horizontal | 水印水平间距 | 30         | 否  | 50                         |
| vertical   | 水印垂直间距 | 30         | 否  | 100                        |

### api
render 渲染水印
```js
const watermark = new SvgWatermark();
watermark.render({
    value: '我是水印',
    rotate: -45
});
```

createSVG 获取svg元素，无渲染逻辑
```js
watermark.createSVG({
    value: '我是水印',
    rotate: -45
});

```
clear 清楚render的水印

```js
watermark.clear();
```

## 如何开发
```
cd site && yarn
npm run start
```