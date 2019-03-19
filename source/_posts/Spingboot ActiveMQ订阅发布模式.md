---
title: Spingboot ActiveMQ订阅发布模式
tag: Springboot 
category: Springboot
date: 2019-02-27
---

>使用场景：
>人员通过人脸识别以及证件比对，车辆车牌号识别上传事件；消费者通过事件订阅获取人证比对事件类型，车辆通过车牌号识别车辆驶入和驶离事件类型，将监听到的消息事件同步保存到本地，便于图形化展示。

## ActiveMQ
ActiveMQ官网下载地址：http://activemq.apache.org/download.html
安装、启动之后，http://127.0.0.1:8161 admin admin 的默认账户登陆到ActiveMQ主界面中，topics和queues消息订阅监控查询可以通过发布以及订阅消息来测试配置等。

## Topic和Queue
Topic：发布/订阅，可多个消费者同时订阅
Queue：点对点，可以有多个消费者但是消息不能重复被消费。通过先进先出顺序存储，消息被消费了才被删除。
本次使用Topic一对多的消息接收策略。

## 配置
### pom.xml中添加依赖

```java
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-activemq</artifactId>
</dependency>
```

### 创建ActiveMQ启动配置类
项目中需要的是多个topic消息队列的监听

```java
import javax.jms.Topic;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.command.ActiveMQTopic;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.config.DefaultJmsListenerContainerFactory;

import cc.army.hkapi.mq.MQClientUtil;
 
@Configuration  
@EnableJms
public class ActiveMQ4Config {  
 
	@Bean
	public Topic topic() throws Exception{
	    // 获取第一个acs
		String DES = MQClientUtil.getMQInfoAcs().getString("destination");
		return new ActiveMQTopic(DES);
	}
	
	@Bean
	public Topic topicpms() throws Exception{
		// 获取第二个pms
		String DES = MQClientUtil.getMQInfoPms().getString("destination");
		return new ActiveMQTopic(DES);
	}

	@Bean(name="activeMQConnectionFactory")
    public ActiveMQConnectionFactory activeMQConnectionFactory() throws Exception{  
        String BROKER_URL = MQClientUtil.getMQInfoAcs().getString("mqURL");
    	ActiveMQConnectionFactory activeMQConnectionFactory =  
                new ActiveMQConnectionFactory("failover:(tcp://"+BROKER_URL+")");
        return activeMQConnectionFactory;
    }
    
    //定义一个消息监听器连接工厂，这里定义的是topic模式的监听器连接工厂
    @Bean(name = "jmsTopicListener")
    public DefaultJmsListenerContainerFactory jmsTopicListenerContainerFactory(@Qualifier("activeMQConnectionFactory")ActiveMQConnectionFactory activeMQConnectionFactory) {
        DefaultJmsListenerContainerFactory factory =
                new DefaultJmsListenerContainerFactory();
        factory.setConnectionFactory(activeMQConnectionFactory);
        factory.setConcurrency("2-10");//设置连接数
        factory.setPubSubDomain(true); //topic
        return factory;
    }
} 

```
## 实现消息消费者
@JmsListener注解标识监听哪一个消息队列。
1. 人员进出门记录监听以及同步

```java
import javax.jms.BytesMessage;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
......

@Component
public class Consumer {
 
	private final static Logger logger = LoggerFactory.getLogger(Consumer.class);
	
	@JmsListener(destination = "openapi.acs.topic", containerFactory = "jmsTopicListener")
	public void receiveTopic(Message msg, Session session)
			throws JMSException {
		try {
            // cms里发送的消息为BytesMessage，此处不做判断亦可
            if (msg instanceof BytesMessage) {
                BytesMessage bytesMessage = (BytesMessage)msg;
                long length = bytesMessage.getBodyLength();
                byte[] bt = new byte[(int)length];
                // 将BytesMessage转换为byte类型
                bytesMessage.readBytes(bt);
                // 壳文件字段，EventDis类为event_dis.proto文件解析而来，CommEventLog类为事件壳文件类
                EventDis.CommEventLog parseFrom = EventDis.CommEventLog.parseFrom(bt);
                // 扩展字段，此字段为设备上报事件内容，部分事件需要使用pb文件再次解析
                ByteString extInfo = parseFrom.getExtInfo();
                // 输出扩展字段
                logger.info("extInfo "+extInfo.toStringUtf8());
                AcsEvent.AccessEventLog aa = AcsEvent.AccessEventLog.parseFrom(extInfo);
                if(aa.getEventCode()==Constant.COMMON_FACE) {//人证比对通过
                	logger.info("83912960[人证比对]订阅事件通过");
                	//人员同步业务处理...
				}    
            }
		} catch (Exception e) {	
			logger.error("监听错误信息为："+e.getMessage());
		}
	}
	
```
2. 车辆进出门记录监听以及同步

```java

import javax.jms.BytesMessage;
import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;
......

@Component
public class ConsumerPms {
 
	private final static Logger logger = LoggerFactory.getLogger(ConsumerPms.class);
	
	@JmsListener(destination = "openapi.pms.topic", containerFactory = "jmsTopicListener")
	public void receiveTopicPms(Message msg, Session session)
			throws JMSException {
		try {
            // cms里发送的消息为BytesMessage，此处不做判断亦可
            if (msg instanceof BytesMessage) {
                BytesMessage bytesMessage = (BytesMessage)msg;
                long length = bytesMessage.getBodyLength();
                byte[] bt = new byte[(int)length];
                // 将BytesMessage转换为byte类型
                bytesMessage.readBytes(bt);
                // 壳文件字段，EventDis类为event_dis.proto文件解析而来，CommEventLog类为事件壳文件类
                EventDis.CommEventLog parseFrom = EventDis.CommEventLog.parseFrom(bt);
                // 扩展字段，此字段为设备上报事件内容，部分事件需要使用pb文件再次解析
                ByteString extInfo = parseFrom.getExtInfo();
                // 输出扩展字段
                logger.info("extInfo "+extInfo.toStringUtf8());
                PmsEvent.MsgPmsEvent aa = PmsEvent.MsgPmsEvent.parseFrom(extInfo);
                if(parseFrom.getEventType()==Constant.COMMON_CAR_ENTER) {//车辆停入
                	//车辆驶入记录同步业务处理...
                }
                if(parseFrom.getEventType()==Constant.COMMON_CAR_OUT) {//车辆驶离
                	//车辆驶离记录同步业务处理...
                }
            }
		} catch (Exception e) {	
			logger.error("车辆进出监听错误信息为："+e.getMessage());
		}
	}		
```

本次使用中事件订阅会有消息重复接收的问题，同步记录时可以通过数据库索引等方式做预处理。

扩展学习 [Kafka下的生产消费者模式与订阅发布模式](https://blog.csdn.net/zwgdft/article/details/54633105) 



