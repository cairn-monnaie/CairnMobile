import { AnimationCurve } from '@akylas/nativescript/ui/enums';
import { GestureHandlerStateEvent, GestureHandlerTouchEvent, GestureState, GestureStateEventData, GestureTouchEventData, HandlerType, Manager, PanGestureHandler } from '@nativescript-community/gesturehandler/gesturehandler';
import { TextField } from '@nativescript-community/ui-material-textfield';
import { Component, Prop } from 'vue-property-decorator';
import { AccountInfo, Benificiary, Roles, User } from '../services/AuthService';
import PageComponent from './PageComponent';

interface Recipient extends User {
    isBeneficiary?: boolean;
}

@Component({})
export default class TransferConfirmation extends PageComponent {
    @Prop() account: AccountInfo;
    @Prop() recipient: User;
    @Prop() amount: number;
    @Prop() reason: string;
    @Prop() description: string;
  
  
    panGestureHandler: PanGestureHandler;
    destroyed() {
        super.destroyed();
        const gestureHandler = this.panGestureHandler;
        if (gestureHandler) {
            gestureHandler.detachFromView(this.nativeView);
            gestureHandler.off(GestureHandlerTouchEvent, this.onGestureTouch, this);
            gestureHandler.off(GestureHandlerStateEvent, this.onGestureState, this);
            this.panGestureHandler = null;
        }
        
    }
    mounted() {
        super.mounted();
        const manager = Manager.getInstance();
            const gestureHandler = this.panGestureHandler = manager.createGestureHandler(HandlerType.PAN, 12512, {
                shouldCancelWhenOutside: false,
            activeOffsetY: 5,
            failOffsetY: -5,
            });
            gestureHandler.on(GestureHandlerTouchEvent, this.onGestureTouch, this);
        gestureHandler.on(GestureHandlerStateEvent, this.onGestureState, this);
        gestureHandler.attachToView(this.nativeView)
    }
    close() {
        this.$modal.close()
    }

    prevDeltaY = 0;
    onGestureState(args: GestureStateEventData) {
        const { state, prevState, extraData, view } = args.data;
        if (state === GestureState.ACTIVE) {
            this.prevDeltaY = extraData.translationY;
        }
        if (prevState === GestureState.ACTIVE) {
            const { velocityY, translationY } = extraData;

            const dragToss = 0.05;
            const endOffsetY = translationY - this.prevDeltaY + dragToss * velocityY;
            if (Math.abs(endOffsetY - this.nativeView.translateY) > 30) {
                const height = this.nativeView.getMeasuredHeight();
                this.nativeView.animate({
                    translate:{x:0, y : endOffsetY > 0?height : -height},
                    duration:300,
                    curve: AnimationCurve.easeOut
                }).then(()=>{this.close()})
            } else {
                this.nativeView.animate({
                    translate:{x:0, y : 0},
                    duration:200,
                    curve: AnimationCurve.spring
                })
            }

            // const steps = [0].concat(this.peekerSteps);
            // let destSnapPoint = steps[0];
            // // console.log('onPan', 'done', viewTop, translationY, this.prevDeltaY, dragToss, velocityY, endOffsetY, steps);
            // for (let i = 0; i < steps.length; i++) {
            //     const snapPoint = steps[i];
            //     const distFromSnap = Math.abs(snapPoint + endOffsetY);
            //     if (distFromSnap <= Math.abs(destSnapPoint + endOffsetY)) {
            //         destSnapPoint = snapPoint;
            //     }
            // }
            // // if (destSnapPoint === 0) {
            // //     this.$emit('');
            // // }
            // this.scrollSheetToPosition(destSnapPoint);
            this.prevDeltaY = 0;
        }
        }
    onGestureTouch(args: GestureTouchEventData) {
        const data = args.data;
        // this.log('onGestureTouch', this._isPanning, this.panEnabled, this.isAnimating, data.state, data.extraData.translationY, this.prevDeltaY);

        if (data.state !== GestureState.ACTIVE) {
            return;
        }
        const deltaY = data.extraData.translationY;
        this.nativeView.translateY = deltaY - this.prevDeltaY
    }
}
