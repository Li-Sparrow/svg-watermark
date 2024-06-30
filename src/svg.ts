import { IWatermarkInfo } from './interface';
import { createElementSVGPattern, createElementSVGText, createElementSVG, measureText } from './utils';

class SVGWatermarkCreator {
    /**
     * 创建水印
     * 1 计算水印文本的宽高，得到pattern的宽高
     * 2 创建 text -> pattern -> svg
     * @param watermarkInfo 
     * @returns 
     */
    create(watermarkInfo: IWatermarkInfo) {
        if (!watermarkInfo.value) {
            throw new Error('Watermark Params Error');
        }

        const {
            value: content,
            rotate = -45, // 旋转角度
            fillStyle = '#000000', // svg填充的样式
            font = '', // 字体
            horizontal = 30,
            vertical = 30
        } = watermarkInfo;

        // 测量尺寸
        const textResult = this.calText(content, font, {
            top: vertical / 2,
            bottom: vertical / 2,
            left: horizontal / 2,
            right: horizontal / 2
        });

        const patternId = 'watermark-' + Date.now();
        const patternElement = createElementSVGPattern(patternId, textResult.width, textResult.height);

        textResult.arr.forEach((textInfo: any) => {
            const style = {
                font,
                fill: fillStyle,
                whiteSpace: 'pre'
            };

            const attributes = {
                x: textInfo.x,
                y: textInfo.y,
                transform: `rotate(${rotate},${textInfo.rotateX},${textInfo.rotateY})`
            }

            const textNode = createElementSVGText(patternElement, style, attributes);
            textNode.appendChild(document.createTextNode(textInfo.str));
        });

        return createElementSVG(patternElement, patternId);
    }

    /**
     * 文本计算
     * @param text 
     * @param font 
     * @param padding 
     * @returns 
     */
    private calText(text: string, font: string, padding: any) {
        const str = text.replace(/(\r\n)|(\r)|(\n)/g, String.fromCharCode(10));
        const strArr = str.split(String.fromCharCode(10));

        // parent元素的宽高
        let parentHeight = 0;
        let parentWidth = 0;

        // 最大的本文高度
        let maxTextHeight = 0;

        // 旋转的中心 x 坐标
        let rotateX = 0;

        // 水印位置数据
        const strPositionTmp: any = [];

        strArr.forEach((_str: string, i: number) => {
            if (_str) {
                // 测量文字的宽高
                const ms = measureText(_str, font);

                // 拿最大的宽度作为parent容器的高度
                parentHeight = Math.max(parentHeight, ms.width);
                // 记录最大的本文高度
                maxTextHeight = Math.max(maxTextHeight, ms.height);

                const halfWidth = ms.width / 2;

                // 第一个水印，旋转中心点，以本文中心为x坐标
                // 后面的水印，旋转中心点，添加固定的距离，保证水印的距离可调整
                if (!rotateX) {
                    rotateX += halfWidth;
                } else {
                    rotateX += 100;
                }

                // 计算出parent元素需要的宽度
                if (i === (strArr.length - 1)) {
                    parentWidth = rotateX + halfWidth;
                }

                strPositionTmp.push({
                    str: _str, // 文本
                    textHeight: ms.height, // 文本高度
                    textWidth: ms.width,
                    rotateX, // 旋转的x
                    x: rotateX - halfWidth // x 起点
                });
            }
        });

        // 存放多水印的x y rotateX rotateY数据
        const arr: any = [];

        // 避免容器太小，密密麻麻都是水印
        const minParentWidth = 200;
        const minParentHeight = 200;

        if (parentWidth < minParentWidth) {
            const _padding = (minParentWidth - parentWidth) / 2;

            if (padding.left < _padding) {
                padding.left = _padding;
            }

            if (padding.right < _padding) {
                padding.right = _padding;
            }
        }

        if (parentHeight < minParentHeight) {
            const _padding = (minParentHeight - parentHeight) / 2;

            if (padding.top < _padding) {
                padding.top = _padding;
            }

            if (padding.bottom < _padding) {
                padding.bottom = _padding;
            }
        }

        // 水印的x坐标，根据每个水印的rotateX，减去文本长度一半
        // 水印的y坐标和rotateY，根据parent元素的高度，减去文本高度，取一半的的距离
        strPositionTmp.forEach((item: any) => {
            const y = ((parentHeight - item.textHeight) / 2) + padding.top;

            item.y = y;
            item.rotateY = y;
            arr.push({
                x: item.x + padding.left,
                y: y,
                rotateX: item.rotateX + padding.left,
                rotateY: y,
                str: item.str
            });
        });

        return {
            width: parentWidth + padding.left + padding.right,
            height: parentHeight + padding.top + padding.bottom,
            arr
        };
    }
}

export default new SVGWatermarkCreator();