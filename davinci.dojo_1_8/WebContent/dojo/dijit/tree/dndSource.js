//>>built
define("dijit/tree/dndSource",["dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/dom-class","dojo/dom-geometry","dojo/_base/lang","dojo/on","dojo/touch","dojo/topic","dojo/dnd/Manager","./_dndSelector"],function(_1,_2,_3,_4,_5,_6,on,_7,_8,_9,_a){return _3("dijit.tree.dndSource",_a,{isSource:true,accept:["text","treeNode"],copyOnly:false,dragThreshold:5,betweenThreshold:0,generateText:true,constructor:function(_b,_c){if(!_c){_c={};}_6.mixin(this,_c);this.isSource=typeof _c.isSource=="undefined"?true:_c.isSource;var _d=_c.accept instanceof Array?_c.accept:["text","treeNode"];this.accept=null;if(_d.length){this.accept={};for(var i=0;i<_d.length;++i){this.accept[_d[i]]=1;}}this.isDragging=false;this.mouseDown=false;this.targetAnchor=null;this.targetBox=null;this.dropPosition="";this._lastX=0;this._lastY=0;this.sourceState="";if(this.isSource){_4.add(this.node,"dojoDndSource");}this.targetState="";if(this.accept){_4.add(this.node,"dojoDndTarget");}this.topics=[_8.subscribe("/dnd/source/over",_6.hitch(this,"onDndSourceOver")),_8.subscribe("/dnd/start",_6.hitch(this,"onDndStart")),_8.subscribe("/dnd/drop",_6.hitch(this,"onDndDrop")),_8.subscribe("/dnd/cancel",_6.hitch(this,"onDndCancel"))];},checkAcceptance:function(){return true;},copyState:function(_e){return this.copyOnly||_e;},destroy:function(){this.inherited(arguments);var h;while(h=this.topics.pop()){h.remove();}this.targetAnchor=null;},_onDragMouse:function(e,_f){var m=_9.manager(),_10=this.targetAnchor,_11=this.current,_12=this.dropPosition;var _13="Over";if(_11&&this.betweenThreshold>0){if(!this.targetBox||_10!=_11){this.targetBox=_5.position(_11.rowNode,true);}if((e.pageY-this.targetBox.y)<=this.betweenThreshold){_13="Before";}else{if((e.pageY-this.targetBox.y)>=(this.targetBox.h-this.betweenThreshold)){_13="After";}}}if(_f||_11!=_10||_13!=_12){if(_10){this._removeItemClass(_10.rowNode,_12);}if(_11){this._addItemClass(_11.rowNode,_13);}if(!_11){m.canDrop(false);}else{if(_11==this.tree.rootNode&&_13!="Over"){m.canDrop(false);}else{var _14=false;if(m.source==this){for(var _15 in this.selection){var _16=this.selection[_15];if(_16.item===_11.item){_14=true;break;}}}if(_14){m.canDrop(false);}else{if(this.checkItemAcceptance(_11.rowNode,m.source,_13.toLowerCase())&&!this._isParentChildDrop(m.source,_11.rowNode)){m.canDrop(true);}else{m.canDrop(false);}}}}this.targetAnchor=_11;this.dropPosition=_13;}},onMouseMove:function(e){if(this.isDragging&&this.targetState=="Disabled"){return;}this.inherited(arguments);var m=_9.manager();if(this.isDragging){this._onDragMouse(e);}else{if(this.mouseDown&&this.isSource&&(Math.abs(e.pageX-this._lastX)>=this.dragThreshold||Math.abs(e.pageY-this._lastY)>=this.dragThreshold)){var _17=this.getSelectedTreeNodes();if(_17.length){if(_17.length>1){var _18=this.selection,i=0,r=[],n,p;nextitem:while((n=_17[i++])){for(p=n.getParent();p&&p!==this.tree;p=p.getParent()){if(_18[p.id]){continue nextitem;}}r.push(n);}_17=r;}_17=_1.map(_17,function(n){return n.domNode;});m.startDrag(this,_17,this.copyState(_2.isCopyKey(e)));this._onDragMouse(e,true);}}}},onMouseDown:function(e){this.mouseDown=true;this.mouseButton=e.button;this._lastX=e.pageX;this._lastY=e.pageY;this.inherited(arguments);},onMouseUp:function(e){if(this.mouseDown){this.mouseDown=false;this.inherited(arguments);}},onMouseOut:function(){this.inherited(arguments);this._unmarkTargetAnchor();},checkItemAcceptance:function(){return true;},onDndSourceOver:function(_19){if(this!=_19){this.mouseDown=false;this._unmarkTargetAnchor();}else{if(this.isDragging){var m=_9.manager();m.canDrop(false);}}},onDndStart:function(_1a,_1b,_1c){if(this.isSource){this._changeState("Source",this==_1a?(_1c?"Copied":"Moved"):"");}var _1d=this.checkAcceptance(_1a,_1b);this._changeState("Target",_1d?"":"Disabled");if(this==_1a){_9.manager().overSource(this);}this.isDragging=true;},itemCreator:function(_1e){return _1.map(_1e,function(_1f){return {"id":_1f.id,"name":_1f.textContent||_1f.innerText||""};});},onDndDrop:function(_20,_21,_22){if(this.containerState=="Over"){var _23=this.tree,_24=_23.model,_25=this.targetAnchor;this.isDragging=false;var _26;var _27;var _28;_26=(_25&&_25.item)||_23.item;if(this.dropPosition=="Before"||this.dropPosition=="After"){_26=(_25.getParent()&&_25.getParent().item)||_23.item;_27=_25.getIndexInParent();if(this.dropPosition=="After"){_27=_25.getIndexInParent()+1;_28=_25.getNextSibling()&&_25.getNextSibling().item;}else{_28=_25.item;}}else{_26=(_25&&_25.item)||_23.item;}var _29;_1.forEach(_21,function(_2a,idx){var _2b=_20.getItem(_2a.id);if(_1.indexOf(_2b.type,"treeNode")!=-1){var _2c=_2b.data,_2d=_2c.item,_2e=_2c.getParent().item;}if(_20==this){if(typeof _27=="number"){if(_26==_2e&&_2c.getIndexInParent()<_27){_27-=1;}}_24.pasteItem(_2d,_2e,_26,_22,_27,_28);}else{if(_24.isItem(_2d)){_24.pasteItem(_2d,_2e,_26,_22,_27,_28);}else{if(!_29){_29=this.itemCreator(_21,_25.rowNode,_20);}_24.newItem(_29[idx],_26,_27,_28);}}},this);this.tree._expandNode(_25);}this.onDndCancel();},onDndCancel:function(){this._unmarkTargetAnchor();this.isDragging=false;this.mouseDown=false;delete this.mouseButton;this._changeState("Source","");this._changeState("Target","");},onOverEvent:function(){this.inherited(arguments);_9.manager().overSource(this);},onOutEvent:function(){this._unmarkTargetAnchor();var m=_9.manager();if(this.isDragging){m.canDrop(false);}m.outSource(this);this.inherited(arguments);},_isParentChildDrop:function(_2f,_30){if(!_2f.tree||_2f.tree!=this.tree){return false;}var _31=_2f.tree.domNode;var ids=_2f.selection;var _32=_30.parentNode;while(_32!=_31&&!ids[_32.id]){_32=_32.parentNode;}return _32.id&&ids[_32.id];},_unmarkTargetAnchor:function(){if(!this.targetAnchor){return;}this._removeItemClass(this.targetAnchor.rowNode,this.dropPosition);this.targetAnchor=null;this.targetBox=null;this.dropPosition=null;},_markDndStatus:function(_33){this._changeState("Source",_33?"Copied":"Moved");}});});