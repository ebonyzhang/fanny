---
title: Springboot接口版本管理
tag: Springboot
category: Springboot
date: 2019-02-18
---

>系统上线后，随着需求的变化，接口在调用过程中也会发生变化，为了兼容新老用户的使用方便，需要提供不同需求调用不同接口版本来实现。
>通过更改接口地址方式实现。

## 版本控制
自定义ApiVersion注解，以实现随机获取路径的版本号。
```
import java.lang.annotation.*;

//版本控制
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Mapping
public @interface ApiVersion {
    int value();
}
```

## ApiVersionCondition 
自定义实现了RequestCondition接口，通过正则表达式获得需要匹配的版本号。
```
import org.springframework.web.servlet.mvc.condition.RequestCondition;

import javax.servlet.http.HttpServletRequest;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ApiVersionCondition implements RequestCondition<ApiVersionCondition> {
    // 路径中版本的前缀， 这里用 /v[1-9]/的形式
    private final static Pattern VERSION_PREFIX_PATTERN = Pattern.compile("v(\\d+)/");
    private int apiVersion;

    public ApiVersionCondition(int apiVersion) {
        this.apiVersion = apiVersion;
    }

    @Override
    public ApiVersionCondition combine(ApiVersionCondition other) {
        // 采用最后定义优先原则，则方法上的定义覆盖类上面的定义
        return new ApiVersionCondition(other.getApiVersion());
    }

    @Override
    public ApiVersionCondition getMatchingCondition(HttpServletRequest request) {
        Matcher m = VERSION_PREFIX_PATTERN.matcher(request.getRequestURI());
        if (m.find()) {
            Integer version = Integer.valueOf(m.group(1));
            if (version >= this.apiVersion) {
                return this;
            }
        }
        return null;
    }

    @Override
    public int compareTo(ApiVersionCondition other, HttpServletRequest request) {
        // 优先匹配最新的版本号
        return other.getApiVersion() - this.apiVersion;
    }

    public int getApiVersion() {
        return apiVersion;
    }
}
```

## 自定义CustomRequestMappingHandlerMapping 
自定义CustomRequestMappingHandlerMapping ，继承RequestMappingHandlerMapping，获得注解标注的接口路径，然后返回自定义的实现类。
```
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.web.servlet.mvc.condition.RequestCondition;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.bk.framework.config.ApiVersion;

import java.lang.reflect.Method;

public class CustomRequestMappingHandlerMapping extends RequestMappingHandlerMapping {
    @Override
    protected RequestCondition<ApiVersionCondition> getCustomTypeCondition(Class<?> handlerType) {
        ApiVersion apiVersion = AnnotationUtils.findAnnotation(handlerType, ApiVersion.class);
        return createCondition(apiVersion);
    }

    @Override
    protected RequestCondition<ApiVersionCondition> getCustomMethodCondition(Method method) {
        ApiVersion apiVersion = AnnotationUtils.findAnnotation(method, ApiVersion.class);
        return createCondition(apiVersion);
    }

    private RequestCondition<ApiVersionCondition> createCondition(ApiVersion apiVersion) {
        return apiVersion == null ? null : new ApiVersionCondition(apiVersion.value());
    }
}
```

## WebMvcRegistrations
WebMvcRegistrations接口下提供了WebMvcRegistrationsAdapter转换器，它可以指定自定义的RequestMappingHandlerMapping。

```
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.web.servlet.WebMvcRegistrations;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootConfiguration
public class WebMvcRegistrationsConfig implements WebMvcRegistrations {
    @Override
    public RequestMappingHandlerMapping getRequestMappingHandlerMapping() {
        return new CustomRequestMappingHandlerMapping();
    }
}
```

## 版本测试类HelloController

```
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bk.framework.config.ApiVersion;

/**
 * 接口版本测试类
 */
@RestController
@RequestMapping("/api")
public class HelloController {
	
	@ApiVersion(1)
    @GetMapping("/{version}/version")
    public String test1(){
        return "Hello World! version 1";
    }
	
    @ApiVersion(2)
    @GetMapping("/{version}/version")
    public String test2(){
        return "Hello World! version 2";
    }
}
```

运行 http://localhost:8086/bk/api/v1/version 输出 Hello World! version 1
运行 http://localhost:8086/bk/api/v2/version 输出 Hello World! version 2

>参考 https://blog.csdn.net/u010782227/article/details/74905404
